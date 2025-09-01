import axios from 'axios';
import { Email, EmailConfig, ConnectionStatus } from '@/types/email';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 10000,
});

export const emailService = {
  /**
   * Get test email configuration
   */
  async getConfig(): Promise<EmailConfig> {
    const response = await api.get('/emails/config');
    return response.data;
  },

  /**
   * Get connection status
   */
  async getStatus(): Promise<ConnectionStatus> {
    const response = await api.get('/emails/status');
    return response.data;
  },

  /**
   * Get all processed emails
   */
  async getAllEmails(): Promise<Email[]> {
    const response = await api.get('/emails');
    return response.data;
  },

  /**
   * Get latest processed email
   */
  async getLatestEmail(): Promise<Email> {
    const response = await api.get('/emails/latest');
    return response.data;
  },

  /**
   * Get email by ID
   */
  async getEmailById(id: string): Promise<Email> {
    const response = await api.get(`/emails/${id}`);
    return response.data;
  },
};