import { EmailValidationServiceInterface } from '@faboborgeslima/task-manager-domain/auth';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ValidationCode } from '../domain/validation-code';
import { EmailServiceInterface } from '../../email/domain/email.service.interface';
import { ValidationCodeRepositoryInterface } from '../domain/validation-code.repository.interface';

@Injectable()
export class EmailValidationService implements EmailValidationServiceInterface {
  constructor(
    @Inject(ValidationCodeRepositoryInterface)
    private readonly emailValidationRepository: ValidationCodeRepositoryInterface,
    @Inject(EmailServiceInterface)
    private readonly emailService: EmailServiceInterface,
  ) {}

  async sendValidation(email: string): Promise<void> {
    let emailValidation =
      await this.emailValidationRepository.findByEmail(email);

    if (emailValidation && emailValidation.stillValid()) return;

    emailValidation = emailValidation || ValidationCode.make({ email });

    try {
      await this.emailService.sendEmail(
        email,
        'Email Validation',
        `Your validation code is: ${emailValidation.validationCode}`,
        `<p>Your validation code is: <strong>${emailValidation.validationCode}</strong></p>`,
      );
    } catch {
      throw new InternalServerErrorException(
        'Error sending validation email. Please try again later.',
      );
    }

    await this.emailValidationRepository.save(emailValidation);
  }

  async checkValidation(email: string, validation: string): Promise<boolean> {
    const emailValidation =
      await this.emailValidationRepository.findByEmail(email);

    if (!emailValidation) return false;

    return emailValidation.validationCode === validation;
  }
}
