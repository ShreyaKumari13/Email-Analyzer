import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import Imap = require('imap');
import { Email, EmailDocument } from '../../schemas/email.schema';
import { ProcessedEmail, ImapConfig } from '../../interfaces/email.interface';
import { HeaderParser } from '../../utils/header-parser';
import { ESPDetector } from '../../utils/esp-detector';

@Injectable()
export class EmailService implements OnModuleInit {
  private readonly logger = new Logger(EmailService.name);
  private imap: Imap;
  private isConnected = false;
  private testEmailAddress = process.env.IMAP_USER || 'test-email-analyzer@tempmail.com';
  private testSubjectPrefix = 'ANALYZER-TEST';

  constructor(
    @InjectModel(Email.name) private emailModel: Model<EmailDocument>,
  ) {}

  async onModuleInit() {
    // Initialize IMAP connection if credentials are provided
    if (process.env.IMAP_HOST && process.env.IMAP_USER && process.env.IMAP_PASSWORD) {
      await this.initializeImap();
    } else {
      this.logger.warn('IMAP credentials not provided. Email monitoring disabled.');
    }
  }

  /**
   * Initialize IMAP connection
   */
  private async initializeImap(): Promise<void> {
    try {
      const imapConfig: ImapConfig = {
        host: process.env.IMAP_HOST,
        port: parseInt(process.env.IMAP_PORT) || 993,
        user: process.env.IMAP_USER,
        password: process.env.IMAP_PASSWORD,
        tls: process.env.IMAP_TLS === 'true',
      };

      this.imap = new Imap({
        user: imapConfig.user,
        password: imapConfig.password,
        host: imapConfig.host,
        port: imapConfig.port,
        tls: imapConfig.tls,
        tlsOptions: { rejectUnauthorized: false },
        authTimeout: 10000,
        connTimeout: 15000,
        keepalive: true,
      });

      this.setupImapEvents();
      this.connectToImap();
    } catch (error) {
      this.logger.error('Failed to initialize IMAP:', error);
    }
  }

  /**
   * Setup IMAP event listeners
   */
  private setupImapEvents(): void {
    this.imap.once('ready', () => {
      this.logger.log('IMAP connection ready');
      this.isConnected = true;
      this.openInbox();
    });

    this.imap.once('error', (err) => {
      this.logger.error('IMAP error:', err);
      this.isConnected = false;
    });

    this.imap.once('end', () => {
      this.logger.log('IMAP connection ended');
      this.isConnected = false;
    });
  }

  /**
   * Connect to IMAP server
   */
  private connectToImap(): void {
    try {
      this.imap.connect();
    } catch (error) {
      this.logger.error('Failed to connect to IMAP:', error);
    }
  }

  /**
   * Open inbox and start monitoring
   */
  private openInbox(): void {
    this.imap.openBox('INBOX', false, (err, box) => {
      if (err) {
        this.logger.error('Failed to open inbox:', err);
        return;
      }

      this.logger.log('Inbox opened, monitoring for new emails...');
      
      // Listen for new mail
      this.imap.on('mail', (numNewMsgs) => {
        this.logger.log(`Received ${numNewMsgs} new email(s)`);
        this.fetchNewEmails();
      });

      // Fetch existing emails with test subject
      this.fetchTestEmails();
    });
  }

  /**
   * Fetch new emails
   */
  private fetchNewEmails(): void {
    this.imap.search(['UNSEEN', ['SUBJECT', this.testSubjectPrefix]], (err, results) => {
      if (err) {
        this.logger.error('Search error:', err);
        return;
      }

      if (results.length > 0) {
        this.processEmails(results);
      }
    });
  }

  /**
   * Fetch existing test emails
   */
  private fetchTestEmails(): void {
    this.imap.search([['SUBJECT', this.testSubjectPrefix]], (err, results) => {
      if (err) {
        this.logger.error('Search error:', err);
        return;
      }

      if (results.length > 0) {
        this.logger.log(`Found ${results.length} test emails`);
        this.processEmails(results.slice(-5)); // Process last 5 test emails
      }
    });
  }

  /**
   * Process emails by UID
   */
  private processEmails(uids: number[]): void {
    const fetch = this.imap.fetch(uids, {
      bodies: '',
      struct: true,
    });

    fetch.on('message', (msg, seqno) => {
      let headers: any = {};
      let body = '';

      msg.on('body', (stream, info) => {
        let buffer = '';
        stream.on('data', (chunk) => {
          buffer += chunk.toString('utf8');
        });
        stream.once('end', () => {
          if (info.which === '') {
            // Parse headers and body
            const parts = buffer.split('\r\n\r\n');
            const headerPart = parts[0];
            body = parts.slice(1).join('\r\n\r\n');
            
            headers = this.parseHeaders(headerPart);
          }
        });
      });

      msg.once('end', () => {
        this.processEmailData(headers, body);
      });
    });

    fetch.once('error', (err) => {
      this.logger.error('Fetch error:', err);
    });
  }

  /**
   * Parse email headers
   */
  private parseHeaders(headerText: string): any {
    const headers: any = {};
    const lines = headerText.split('\r\n');
    let currentHeader = '';
    let currentValue = '';

    for (const line of lines) {
      if (line.match(/^[\s\t]/)) {
        // Continuation of previous header
        currentValue += ' ' + line.trim();
      } else if (line.includes(':')) {
        // Save previous header
        if (currentHeader) {
          const key = currentHeader.toLowerCase();
          if (headers[key]) {
            headers[key] = Array.isArray(headers[key]) ? headers[key] : [headers[key]];
            headers[key].push(currentValue);
          } else {
            headers[key] = currentValue;
          }
        }
        
        // Start new header
        const colonIndex = line.indexOf(':');
        currentHeader = line.substring(0, colonIndex).trim();
        currentValue = line.substring(colonIndex + 1).trim();
      }
    }

    // Save last header
    if (currentHeader) {
      const key = currentHeader.toLowerCase();
      headers[key] = currentValue;
    }

    return headers;
  }

  /**
   * Process email data and save to database
   */
  private async processEmailData(headers: any, body: string): Promise<void> {
    try {
      const messageId = headers['message-id'] || `generated-${Date.now()}`;
      
      // Check if already processed
      const existing = await this.emailModel.findOne({ messageId });
      if (existing) {
        this.logger.log(`Email ${messageId} already processed`);
        return;
      }

      // Parse receiving chain
      const receivingChainSteps = HeaderParser.parseReceivingChain(headers);
      const receivingChain = receivingChainSteps.map(step => step.server);

      // Detect ESP
      const espResult = ESPDetector.detectESP(headers);

      // Extract relevant headers
      const relevantHeaders = HeaderParser.extractRelevantHeaders(headers);

      // Create processed email object
      const processedEmail: ProcessedEmail = {
        messageId,
        subject: headers.subject || 'No Subject',
        from: headers.from || 'Unknown Sender',
        to: headers.to || 'Unknown Recipient',
        date: new Date(headers.date || Date.now()),
        rawHeaders: relevantHeaders,
        receivingChain,
        espType: espResult.espType,
        espConfidence: espResult.confidence,
        body: body.substring(0, 1000), // Limit body size
      };

      // Save to database
      const emailDoc = new this.emailModel({
        ...processedEmail,
        processingStatus: 'completed',
      });

      await emailDoc.save();
      this.logger.log(`Successfully processed email: ${messageId} (ESP: ${espResult.espType})`);

    } catch (error) {
      this.logger.error('Error processing email:', error);
    }
  }

  /**
   * Get test email configuration
   */
  getTestEmailConfig(): { email: string; subject: string } {
    return {
      email: this.testEmailAddress,
      subject: `${this.testSubjectPrefix}-${Date.now()}`,
    };
  }

  /**
   * Get all processed emails
   */
  async getAllEmails(): Promise<Email[]> {
    return this.emailModel.find().sort({ createdAt: -1 }).limit(50);
  }

  /**
   * Get email by ID
   */
  async getEmailById(id: string): Promise<Email | null> {
    return this.emailModel.findById(id);
  }

  /**
   * Get latest processed email
   */
  async getLatestEmail(): Promise<Email | null> {
    return this.emailModel.findOne().sort({ createdAt: -1 });
  }

  /**
   * Get connection status
   */
  getConnectionStatus(): { connected: boolean; email: string } {
    return {
      connected: this.isConnected,
      email: this.testEmailAddress,
    };
  }
}