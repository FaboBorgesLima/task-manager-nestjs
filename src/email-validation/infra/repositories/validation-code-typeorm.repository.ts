import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ValidationCodeEntity } from '../entities/validation-code.entity';
import { Repository } from 'typeorm';
import { ValidationCodeRepositoryInterface } from '../../domain/validation-code.repository.interface';
import { ValidationCode } from '../../domain/validation-code';
import { ValidationCodeAdapter } from '../adapters/validation-code.adapter';

@Injectable()
export class ValidationCodeTypeormRepository
  implements ValidationCodeRepositoryInterface
{
  constructor(
    @InjectRepository(ValidationCodeEntity)
    private readonly emailValidationRepository: Repository<ValidationCodeEntity>,
  ) {
    //
  }

  async delete(emailValidation: ValidationCode): Promise<void> {
    const entity =
      ValidationCodeAdapter.fromDomain(emailValidation).toPersistence();
    await this.emailValidationRepository.remove(entity);
  }

  async save(validationCode: ValidationCode): Promise<ValidationCode> {
    let entity =
      ValidationCodeAdapter.fromDomain(validationCode).toPersistence();
    entity = await this.emailValidationRepository.save(entity);

    return ValidationCodeAdapter.fromPersistence(entity).toDomain();
  }

  async findByEmail(email: string): Promise<ValidationCode | void> {
    const entity = await this.emailValidationRepository.findOne({
      where: { email },
    });

    if (!entity) return;

    return ValidationCodeAdapter.fromPersistence(entity).toDomain();
  }
}
