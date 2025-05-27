import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailServiceInterface } from '../domain/email.service.interface';

@Module({
  providers: [{ provide: EmailServiceInterface, useClass: EmailService }],
  exports: [{ provide: EmailServiceInterface, useClass: EmailService }],
})
export class EmailModule {}
