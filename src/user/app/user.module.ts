import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from '../domain/user.repository';
import { UserTypeORMRepository } from '../infra/repositories/user-typeorm.repository';
import { UserEntity } from '../infra/user.entity';

@Module({
  controllers: [UserController],
  providers: [
    {
      provide: UserRepository,
      useClass: UserTypeORMRepository,
    },
  ],
  imports: [TypeOrmModule.forFeature([UserEntity])],
})
export class UserModule {}
