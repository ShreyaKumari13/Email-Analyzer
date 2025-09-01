import { ESPDetectionResult } from '../interfaces/email.interface';

export class ESPDetector {
  /**
   * Detect ESP type from email headers
   */
  static detectESP(headers: any): ESPDetectionResult {
    const indicators: string[] = [];
    let espType = 'Unknown';
    let confidence = 0;

    // Gmail detection
    if (this.isGmail(headers)) {
      espType = 'Gmail';
      confidence = 0.95;
      indicators.push('Google SMTP servers', 'Gmail message-ID pattern');
    }
    // Outlook/Hotmail detection
    else if (this.isOutlook(headers)) {
      espType = 'Outlook/Hotmail';
      confidence = 0.90;
      indicators.push('Microsoft Exchange servers', 'Outlook headers');
    }
    // Amazon SES detection
    else if (this.isAmazonSES(headers)) {
      espType = 'Amazon SES';
      confidence = 0.95;
      indicators.push('Amazon SES servers', 'SES-specific headers');
    }
    // SendGrid detection
    else if (this.isSendGrid(headers)) {
      espType = 'SendGrid';
      confidence = 0.90;
      indicators.push('SendGrid infrastructure', 'SendGrid headers');
    }
    // Mailgun detection
    else if (this.isMailgun(headers)) {
      espType = 'Mailgun';
      confidence = 0.90;
      indicators.push('Mailgun servers', 'Mailgun-specific headers');
    }
    // Yahoo detection
    else if (this.isYahoo(headers)) {
      espType = 'Yahoo Mail';
      confidence = 0.85;
      indicators.push('Yahoo SMTP servers', 'Yahoo headers');
    }
    // Zoho detection
    else if (this.isZoho(headers)) {
      espType = 'Zoho Mail';
      confidence = 0.85;
      indicators.push('Zoho servers', 'Zoho-specific patterns');
    }
    // Generic ESP detection based on common patterns
    else {
      const genericResult = this.detectGenericESP(headers);
      espType = genericResult.espType;
      confidence = genericResult.confidence;
      indicators.push(...genericResult.indicators);
    }

    return {
      espType,
      confidence,
      indicators
    };
  }

  private static isGmail(headers: any): boolean {
    const messageId = headers['message-id'] || '';
    const received = this.getReceivedHeaders(headers);
    
    return (
      messageId.includes('gmail.com') ||
      received.some(r => r.includes('gmail-smtp') || r.includes('google.com') || r.includes('googlemail.com'))
    );
  }

  private static isOutlook(headers: any): boolean {
    const messageId = headers['message-id'] || '';
    const received = this.getReceivedHeaders(headers);
    
    return (
      messageId.includes('outlook.com') ||
      messageId.includes('hotmail.com') ||
      messageId.includes('live.com') ||
      received.some(r => 
        r.includes('outlook.com') || 
        r.includes('hotmail.com') || 
        r.includes('protection.outlook.com') ||
        r.includes('mail.protection.outlook.com')
      )
    );
  }

  private static isAmazonSES(headers: any): boolean {
    const received = this.getReceivedHeaders(headers);
    const messageId = headers['message-id'] || '';
    
    return (
      received.some(r => 
        r.includes('amazonses.com') || 
        r.includes('ses.amazonaws.com') ||
        r.includes('email.us-east-1.amazonaws.com')
      ) ||
      messageId.includes('amazonses.com')
    );
  }

  private static isSendGrid(headers: any): boolean {
    const received = this.getReceivedHeaders(headers);
    const messageId = headers['message-id'] || '';
    
    return (
      received.some(r => r.includes('sendgrid')) ||
      messageId.includes('sendgrid') ||
      headers['x-sg-eid'] ||
      headers['x-sendgrid-message-id']
    );
  }

  private static isMailgun(headers: any): boolean {
    const received = this.getReceivedHeaders(headers);
    const messageId = headers['message-id'] || '';
    
    return (
      received.some(r => r.includes('mailgun')) ||
      messageId.includes('mailgun') ||
      headers['x-mailgun-variables'] ||
      headers['x-mailgun-sid']
    );
  }

  private static isYahoo(headers: any): boolean {
    const messageId = headers['message-id'] || '';
    const received = this.getReceivedHeaders(headers);
    
    return (
      messageId.includes('yahoo.com') ||
      received.some(r => r.includes('yahoo.com') || r.includes('yahoodns.net'))
    );
  }

  private static isZoho(headers: any): boolean {
    const messageId = headers['message-id'] || '';
    const received = this.getReceivedHeaders(headers);
    
    return (
      messageId.includes('zoho.com') ||
      received.some(r => r.includes('zoho.com') || r.includes('zohomx.com'))
    );
  }

  private static detectGenericESP(headers: any): ESPDetectionResult {
    const received = this.getReceivedHeaders(headers);
    const messageId = headers['message-id'] || '';
    const returnPath = headers['return-path'] || '';
    
    // Common ESP patterns
    const espPatterns = [
      { name: 'Mailchimp', patterns: ['mailchimp', 'mcsv.net'] },
      { name: 'Constant Contact', patterns: ['constantcontact', 'ctctcdn.com'] },
      { name: 'Campaign Monitor', patterns: ['campaignmonitor', 'createsend.com'] },
      { name: 'AWeber', patterns: ['aweber.com'] },
      { name: 'GetResponse', patterns: ['getresponse.com'] },
      { name: 'ConvertKit', patterns: ['convertkit.com'] },
      { name: 'ActiveCampaign', patterns: ['activecampaign.com'] },
      { name: 'Mandrill', patterns: ['mandrillapp.com'] },
      { name: 'Postmark', patterns: ['postmarkapp.com'] },
      { name: 'SparkPost', patterns: ['sparkpost.com'] }
    ];

    for (const esp of espPatterns) {
      const found = esp.patterns.some(pattern => 
        messageId.includes(pattern) ||
        returnPath.includes(pattern) ||
        received.some(r => r.includes(pattern))
      );

      if (found) {
        return {
          espType: esp.name,
          confidence: 0.80,
          indicators: [`${esp.name} infrastructure detected`]
        };
      }
    }

    return {
      espType: 'Unknown',
      confidence: 0.10,
      indicators: ['No known ESP patterns detected']
    };
  }

  private static getReceivedHeaders(headers: any): string[] {
    const received = headers['received'] || [];
    return Array.isArray(received) ? received : [received];
  }
}