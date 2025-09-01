import { ReceivingChainStep } from '../interfaces/email.interface';

export class HeaderParser {
  /**
   * Parse the Received headers to extract the email receiving chain
   */
  static parseReceivingChain(headers: any): ReceivingChainStep[] {
    const receivedHeaders = headers['received'] || [];
    const chain: ReceivingChainStep[] = [];

    // Ensure receivedHeaders is an array
    const receivedArray = Array.isArray(receivedHeaders) ? receivedHeaders : [receivedHeaders];

    receivedArray.forEach((received: string, index: number) => {
      if (typeof received === 'string') {
        const step = this.parseReceivedHeader(received, index);
        if (step) {
          chain.push(step);
        }
      }
    });

    return chain.reverse(); // Reverse to show chronological order
  }

  /**
   * Parse individual Received header line
   */
  private static parseReceivedHeader(received: string, index: number): ReceivingChainStep | null {
    try {
      // Extract server information
      const fromMatch = received.match(/from\s+([^\s]+)/i);
      const byMatch = received.match(/by\s+([^\s]+)/i);
      const withMatch = received.match(/with\s+([^\s]+)/i);
      const ipMatch = received.match(/\[(\d+\.\d+\.\d+\.\d+)\]/);
      const dateMatch = received.match(/;\s*(.+)$/);

      const server = fromMatch?.[1] || byMatch?.[1] || `server-${index + 1}`;
      
      let timestamp = new Date();
      if (dateMatch?.[1]) {
        const parsedDate = new Date(dateMatch[1].trim());
        if (!isNaN(parsedDate.getTime())) {
          timestamp = parsedDate;
        }
      }

      return {
        server: server,
        timestamp: timestamp,
        ip: ipMatch?.[1],
        by: byMatch?.[1],
        with: withMatch?.[1]
      };
    } catch (error) {
      console.error('Error parsing received header:', error);
      return null;
    }
  }

  /**
   * Extract all relevant headers for analysis
   */
  static extractRelevantHeaders(headers: any): Record<string, any> {
    const relevantHeaders: Record<string, any> = {};
    
    const importantHeaders = [
      'received',
      'message-id',
      'from',
      'to',
      'subject',
      'date',
      'return-path',
      'reply-to',
      'x-originating-ip',
      'x-mailer',
      'x-sender',
      'authentication-results',
      'received-spf',
      'dkim-signature',
      'list-unsubscribe'
    ];

    importantHeaders.forEach(header => {
      if (headers[header]) {
        relevantHeaders[header] = headers[header];
      }
    });

    return relevantHeaders;
  }
}