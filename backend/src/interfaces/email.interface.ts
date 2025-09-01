export interface ProcessedEmail {
  messageId: string;
  subject: string;
  from: string;
  to: string;
  date: Date;
  rawHeaders: Record<string, any>;
  receivingChain: string[];
  espType: string;
  espConfidence: number;
  body: string;
}

export interface ReceivingChainStep {
  server: string;
  timestamp: Date;
  ip?: string;
  by?: string;
  with?: string;
}

export interface ESPDetectionResult {
  espType: string;
  confidence: number;
  indicators: string[];
}

export interface ImapConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  tls: boolean;
}