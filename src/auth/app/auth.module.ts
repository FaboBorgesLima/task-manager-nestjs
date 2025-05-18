import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AbstractAuthService } from '../domain/abstract-auth.service';
import { AuthJwtService } from '../infra/services/auth-jwt.service';
import { HashService } from '../../hash/app/hash.service';
import { JwtConfigModule } from '../../jwt/jwt-config.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../../user/infra/user.entity';
import { HashServiceInterface } from '../../hash/domain/hash.service.interface';
import { UserRepositoryInterface } from '../../user/domain/user.repository.interface';
import { UserTypeORMService } from '../../user/infra/services/user-typeorm.service';

@Module({
  controllers: [AuthController],
  providers: [
    {
      provide: UserRepositoryInterface,
      useClass: UserTypeORMService,
    },
    {
      provide: AbstractAuthService,
      useClass: AuthJwtService,
    },
    {
      provide: HashServiceInterface,
      useClass: HashService,
    },
  ],
  imports: [JwtConfigModule, TypeOrmModule.forFeature([UserEntity])],
  exports: [
    {
      provide: AbstractAuthService,
      useClass: AuthJwtService,
    },
    {
      provide: HashServiceInterface,
      useClass: HashService,
    },
    {
      provide: UserRepositoryInterface,
      useClass: UserTypeORMService,
    },
    TypeOrmModule.forFeature([UserEntity]),
  ],
})
export class AuthModule {}
