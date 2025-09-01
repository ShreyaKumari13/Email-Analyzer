import { Controller, Get, Param, HttpException, HttpStatus } from '@nestjs/common';
import { EmailService } from './email.service';

@Controller('emails')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  /**
   * Get test email configuration
   */
  @Get('config')
  getTestEmailConfig() {
    return this.emailService.getTestEmailConfig();
  }

  /**
   * Get connection status
   */
  @Get('status')
  getConnectionStatus() {
    return this.emailService.getConnectionStatus();
  }

  /**
   * Get all processed emails
   */
  @Get()
  async getAllEmails() {
    try {
      return await this.emailService.getAllEmails();
    } catch (error) {
      throw new HttpException(
        'Failed to fetch emails',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Get latest processed email
   */
  @Get('latest')
  async getLatestEmail() {
    try {
      const email = await this.emailService.getLatestEmail();
      if (!email) {
        throw new HttpException('No emails found', HttpStatus.NOT_FOUND);
      }
      return email;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to fetch latest email',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Get email by ID
   */
  @Get(':id')
  async getEmailById(@Param('id') id: string) {
    try {
      const email = await this.emailService.getEmailById(id);
      if (!email) {
        throw new HttpException('Email not found', HttpStatus.NOT_FOUND);
      }
      return email;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to fetch email',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}