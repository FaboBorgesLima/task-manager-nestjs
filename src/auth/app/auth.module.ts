import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { UserRepository } from '../../user/domain/user.repository';
import { UserTypeORMRepository } from '../../user/infra/repositories/user-typeorm.repository';
import { AuthRepository } from '../domain/auth.repository';
import { AuthUserRepository } from '../infra/auth-user.repository';
import { UserEntity } from '../../user/infra/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HashMaker } from '../../hash-maker/hash-maker';

@Module({
  controllers: [AuthController],
  providers: [
    {
      provide: AuthRepository,
      useClass: AuthUserRepository,
    },
    {
      provide: UserRepository,
      useClass: UserTypeORMRepository,
    },
    HashMaker,
  ],
  imports: [TypeOrmModule.forFeature([UserEntity])],
})
export class AuthModule {}
