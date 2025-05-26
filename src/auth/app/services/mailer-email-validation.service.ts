import { EmailValidationServiceInterface } from '@faboborgeslima/task-manager-domain/auth';
import { Injectable } from '@nestjs/common';
import nodemailer from 'nodemailer';
import { EmailValidationEntity } from 'src/auth/infra/email-validation.entity';
import { EmailValidationRepository } from 'src/auth/infra/repositories/email-validation.repository';

@Injectable()
export class MailerEmailValidationService
  implements EmailValidationServiceInterface
{
  constructor(
    private readonly emailValidationRepository: EmailValidationRepository,
  ) {}

  private makeCode(): string {
    let code = '';

    for (let i = 0; i < 6; i++) {
      code += Math.floor(Math.random() * 10).toString();
    }

    return code;
  }

  private stillValid(emailValidation: EmailValidationEntity) {
    const now = new Date();
    const diff = now.getTime() - emailValidation.createdAt.getTime();
    const minutes = Math.floor(diff / 1000 / 60);
    return minutes > 5;
  }

  async sendValidation(email: string): Promise<void> {
    let emailValidation =
      await this.emailValidationRepository.findByEmail(email);

    if (emailValidation && !this.stillValid(emailValidation)) return;

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER, // your email address
        pass: process.env.EMAIL_PASSWORD, // your email password
      },
    });
    const code = this.makeCode();

    const sended = await transporter.sendMail({
      from: `"Task Manager" <${process.env.EMAIL_USER}>`, // sender address
      to: email, // list of receivers
      subject: 'Email Validation', // Subject line
      text: 'Please validate your email', // plain text body
      html: `<b>${code}</b>`, // html body
    });

    if (sended.rejected.length > 0) {
      throw new Error('Email not sent');
    }

    emailValidation = emailValidation || new EmailValidationEntity();
    emailValidation.email = email;
    emailValidation.validationCode = code;

    await this.emailValidationRepository.save(emailValidation);
  }
  async checkValidation(email: string, validation: string): Promise<boolean> {
    const emailValidation =
      await this.emailValidationRepository.findByEmail(email);

    if (!emailValidation) return false;

    return emailValidation.validationCode === validation;
  }
}
