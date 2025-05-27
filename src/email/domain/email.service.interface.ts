export interface EmailServiceInterface {
  sendEmail(
    to: string,
    subject: string,
    text: string,
    html: string,
  ): Promise<void>;
}

export const EmailServiceInterface = Symbol('EmailServiceInterface');
