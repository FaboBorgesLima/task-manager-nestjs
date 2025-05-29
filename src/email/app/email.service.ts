import { Injectable } from '@nestjs/common';
import nodemailer from 'nodemailer';
import { EmailServiceInterface } from '../domain/email.service.interface';

@Injectable()
export class EmailService implements EmailServiceInterface {
  private createTransporter() {
    return nodemailer.createTransport({
      service: 'Gmail',
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || '', 10) || 587,
      secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  public async sendEmail(
    to: string,
    subject: string,
    text: string,
    html: string,
  ): Promise<void> {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to,
      subject,
      text,
      html,
    };
    const transporter = this.createTransporter();
    // Send the email
    const sended = await transporter.sendMail(mailOptions);
    if (sended.rejected.length > 0) {
      throw new Error('Email not sent');
    }

    transporter.close();
  }
}
