import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EmailValidationEntity } from '../email-validation.entity';
import { Repository } from 'typeorm';

@Injectable()
export class EmailValidationRepository {
  constructor(
    @InjectRepository(EmailValidationEntity)
    private readonly emailValidationRepository: Repository<EmailValidationEntity>,
  ) {
    //
  }

  async save(emailValidation: EmailValidationEntity): Promise<void> {
    await this.emailValidationRepository.save(emailValidation);
  }

  async findByEmail(email: string): Promise<EmailValidationEntity | null> {
    return this.emailValidationRepository.findOne({
      where: { email },
    });
  }
}
