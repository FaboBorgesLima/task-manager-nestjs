import { ValidationCode } from '../../domain/validation-code';
import { ValidationCodeRepositoryInterface } from '../../domain/validation-code.repository.interface';

export class ValidationCodeMemoryRepository
  implements ValidationCodeRepositoryInterface
{
  public static readonly store: Map<string, ValidationCode> = new Map();

  save(validationCode: ValidationCode): Promise<ValidationCode> {
    ValidationCodeMemoryRepository.store.set(
      validationCode.email,
      validationCode,
    );
    return Promise.resolve(validationCode);
  }

  findByEmail(email: string): Promise<ValidationCode | void> {
    return Promise.resolve(ValidationCodeMemoryRepository.store.get(email));
  }

  delete(validationCode: ValidationCode): Promise<void> {
    ValidationCodeMemoryRepository.store.delete(validationCode.email);
    return Promise.resolve();
  }
}
