export interface Email {
  _id: string;
  messageId: string;
  subject: string;
  from: string;
  to: string;
  date: string;
  rawHeaders: Record<string, unknown>;
  receivingChain: string[];
  espType: string;
  espConfidence: number;
  body: string;
  processingStatus: string;
  error?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EmailConfig {
  email: string;
  subject: string;
}

export interface ConnectionStatus {
  connected: boolean;
  email: string;
}