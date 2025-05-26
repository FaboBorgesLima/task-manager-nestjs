import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './services/auth.service';
import { JwtConfigModule } from '../../jwt/jwt-config.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../../user/infra/user.entity';
import { UserRepositoryInterface } from '@faboborgeslima/task-manager-domain/user';
import { UserTypeormRepository } from '../../user/infra/repositories/user-typeorm.repository';
import {
  AuthRepositoryInterface,
  EmailValidationServiceInterface,
} from '@faboborgeslima/task-manager-domain/auth';
import { MockEmailValidationService } from './services/mock-email-validation.service';
import { AuthJwtRespository } from '../infra/repositories/auth-jwt.repository';

@Module({
  controllers: [AuthController],
  providers: [
    {
      provide: UserRepositoryInterface,
      useClass: UserTypeormRepository,
    },
    {
      provide: EmailValidationServiceInterface,
      useClass: MockEmailValidationService,
    },
    {
      provide: AuthRepositoryInterface,
      useClass: AuthJwtRespository,
    },
    AuthService,
  ],
  imports: [JwtConfigModule, TypeOrmModule.forFeature([UserEntity])],
  exports: [
    AuthService,
    {
      provide: UserRepositoryInterface,
      useClass: UserTypeormRepository,
    },
    {
      provide: AuthRepositoryInterface,
      useClass: AuthJwtRespository,
    },
    {
      provide: EmailValidationServiceInterface,
      useClass: MockEmailValidationService,
    },
    TypeOrmModule.forFeature([UserEntity]),
  ],
})
export class AuthModule {}
