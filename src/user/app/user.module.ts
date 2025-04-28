import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserServiceInterface } from '../domain/user.service';
import { UserTypeORMService } from '../infra/repositories/user-typeorm.service';
import { UserEntity } from '../infra/user.entity';
import { AuthModule } from '../../auth/app/auth.module';

@Module({
  controllers: [UserController],
  providers: [
    {
      provide: UserServiceInterface,
      useClass: UserTypeORMService,
    },
  ],
  imports: [TypeOrmModule.forFeature([UserEntity]), AuthModule],
  exports: [
    {
      provide: UserServiceInterface,
      useClass: UserTypeORMService,
    },
  ],
})
export class UserModule {}
