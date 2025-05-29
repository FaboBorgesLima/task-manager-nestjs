import { Module } from '@nestjs/common';
import { ValidationCodeTypeormRepository } from '../infra/repositories/validation-code-typeorm.repository';
import { ValidationCodeRepositoryInterface } from '../domain/validation-code.repository.interface';
import { EmailValidationService } from './email-validation.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ValidationCodeEntity } from '../infra/entities/validation-code.entity';
import { EmailValidationServiceInterface } from '@faboborgeslima/task-manager-domain/auth';
import { EmailModule } from '../../email/app/email.module';

@Module({
  controllers: [],
  providers: [
    {
      useClass: ValidationCodeTypeormRepository,
      provide: ValidationCodeRepositoryInterface,
    },
    {
      useClass: EmailValidationService,
      provide: EmailValidationServiceInterface,
    },
  ],
  imports: [TypeOrmModule.forFeature([ValidationCodeEntity]), EmailModule],
  exports: [
    {
      useClass: EmailValidationService,
      provide: EmailValidationServiceInterface,
    },
    EmailModule,
    {
      useClass: ValidationCodeTypeormRepository,
      provide: ValidationCodeRepositoryInterface,
    },
  ],
})
export class EmailValidationModule {}
