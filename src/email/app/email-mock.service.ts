import { Injectable } from '@nestjs/common';
import { EmailServiceInterface } from '../domain/email.service.interface';

@Injectable()
export class EmailMockService implements EmailServiceInterface {
  static readonly emails: Map<
    string,
    { subject: string; text: string; html: string }
  > = new Map();

  public sendEmail(
    to: string,
    subject: string,
    text: string,
    html: string,
  ): Promise<void> {
    EmailMockService.emails.set(to, { subject, text, html });

    return Promise.resolve();
  }
}
