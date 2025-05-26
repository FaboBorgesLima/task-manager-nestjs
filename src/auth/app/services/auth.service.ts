import { Inject, Injectable } from '@nestjs/common';
import {
  AuthService as AuthDomainService,
  AuthRepositoryInterface,
  EmailValidationServiceInterface,
} from '@faboborgeslima/task-manager-domain/auth';

@Injectable()
export class AuthService extends AuthDomainService {
  constructor(
    @Inject(AuthRepositoryInterface)
    authRepository: AuthRepositoryInterface,
    @Inject(EmailValidationServiceInterface)
    emailValidationService: EmailValidationServiceInterface,
  ) {
    super(authRepository, emailValidationService);
  }
}
