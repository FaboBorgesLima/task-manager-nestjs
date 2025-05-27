import { ValidationCode } from '../../domain/validation-code';
import { ValidationCodeEntity } from '../entities/validation-code.entity';

export class ValidationCodeAdapter {
  private readonly validationCode: ValidationCode;
  private constructor(validationCode: ValidationCode) {
    this.validationCode = validationCode;
  }
  static fromDomain(validationCode: ValidationCode): ValidationCodeAdapter {
    return new ValidationCodeAdapter(validationCode);
  }

  toDomain(): ValidationCode {
    return this.validationCode;
  }

  static fromPersistence(
    validationCode: ValidationCodeEntity,
  ): ValidationCodeAdapter {
    const domainValidationCode = new ValidationCode({
      email: validationCode.email,
      validationCode: validationCode.validationCode,
      createdAt: validationCode.createdAt,
    });
    return new ValidationCodeAdapter(domainValidationCode);
  }

  toPersistence(): ValidationCodeEntity {
    const entity = new ValidationCodeEntity();
    entity.email = this.validationCode.email;
    entity.validationCode = this.validationCode.validationCode;
    entity.createdAt = this.validationCode.createdAt;
    return entity;
  }
}
