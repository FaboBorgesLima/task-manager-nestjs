import { ValidationCode } from './validation-code';

export interface ValidationCodeRepositoryInterface {
  save(emailValidation: ValidationCode): Promise<ValidationCode>;
  findByEmail(email: string): Promise<ValidationCode | void>;
  delete(emailValidation: ValidationCode): Promise<void>;
}

export const ValidationCodeRepositoryInterface = Symbol(
  'ValidationCodeRepositoryInterface',
);
