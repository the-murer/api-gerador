import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter;
  private readonly logger = new Logger(EmailService.name);

  constructor() {
    // ETHEREAL EMAIL
    this.transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: 'elena.bernier65@ethereal.email',
        pass: 'vXj9JmvWAGHaH4X5ja',
      },
    });
  }

  async sendMail(to: string, subject: string, text: string, html?: string) {
    const info = await this.transporter.sendMail({
      from: `"No Reply" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text,
      html,
    });

    this.logger.log(`Message sent: ${info.messageId}`);
    return info;
  }
}
