import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../domain/user';
import { UserRepository } from '../domain/user.repository';
import { UserTypeORMRepository } from '../infra/repositories/user-typeorm.repository';

@Module({
  controllers: [UserController],
  providers: [
    {
      provide: UserRepository,
      useClass: UserTypeORMRepository,
    },
  ],
  imports: [TypeOrmModule.forFeature([User])],
})
export class UserModule {}
