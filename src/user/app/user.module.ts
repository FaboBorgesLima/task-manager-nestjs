import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserServiceInterface } from '../domain/user.service';
import { UserTypeORMService } from '../infra/services/user-typeorm.service';
import { UserEntity } from '../infra/user.entity';
import { AbstractAuthService } from '../../auth/domain/abstract-auth.service';
import { AuthJwtService } from '../../auth/infra/services/auth-jwt.service';
import { JwtConfigModule } from '../../jwt/jwt-config.module';

@Module({
  controllers: [UserController],
  providers: [
    {
      provide: UserServiceInterface,
      useClass: UserTypeORMService,
    },
    {
      provide: AbstractAuthService,
      useClass: AuthJwtService,
    },
  ],
  imports: [TypeOrmModule.forFeature([UserEntity]), JwtConfigModule],
  exports: [
    {
      provide: UserServiceInterface,
      useClass: UserTypeORMService,
    },
    TypeOrmModule.forFeature([UserEntity]),
  ],
})
export class UserModule {}
