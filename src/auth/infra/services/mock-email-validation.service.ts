import { EmailValidationServiceInterface } from '@faboborgeslima/task-manager-domain/auth';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MockEmailValidationService
  implements EmailValidationServiceInterface
{
  static readonly VALIDATION_CODE = '123456';
  sendValidation(email: string): Promise<void> {
    return Promise.resolve();
  }

  checkValidation(email: string, validation: string): Promise<boolean> {
    // Mock implementation: always return true if validation matches
    return Promise.resolve(
      validation === MockEmailValidationService.VALIDATION_CODE,
    );
  }
}
