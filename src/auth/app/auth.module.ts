import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './services/auth.service';
import { JwtConfigModule } from '../../jwt/jwt-config.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../../user/infra/user.entity';
import { UserRepositoryInterface } from '@faboborgeslima/task-manager-domain/user';
import { UserTypeormRepository } from '../../user/infra/repositories/user-typeorm.repository';
import { AuthRepositoryInterface } from '@faboborgeslima/task-manager-domain/auth';
import { AuthJwtRespository } from '../infra/repositories/auth-jwt.repository';
import { EmailValidationModule } from '../../email-validation/app/email-validation.module';

@Module({
  controllers: [AuthController],
  providers: [
    {
      provide: UserRepositoryInterface,
      useClass: UserTypeormRepository,
    },
    {
      provide: AuthRepositoryInterface,
      useClass: AuthJwtRespository,
    },
    AuthService,
  ],
  imports: [
    JwtConfigModule,
    TypeOrmModule.forFeature([UserEntity]),
    EmailValidationModule,
  ],
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
    TypeOrmModule.forFeature([UserEntity]),
    EmailValidationModule,
  ],
})
export class AuthModule {}
