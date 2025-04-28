import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { UserServiceInterface } from '../../user/domain/user.service';
import { UserTypeORMService } from '../../user/infra/repositories/user-typeorm.service';
import { AuthServiceInterface } from '../domain/auth.service.interface';
import { AuthService } from '../infra/auth.service';
import { UserEntity } from '../../user/infra/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HashMaker } from '../../hash-maker/hash-maker';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [AuthController],
  providers: [
    {
      provide: AuthServiceInterface,
      useClass: AuthService,
    },
    {
      provide: UserServiceInterface,
      useClass: UserTypeORMService,
    },
    HashMaker,
  ],
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '10d' },
    }),
  ],
  exports: [
    {
      provide: AuthServiceInterface,
      useClass: AuthService,
    },
  ],
})
export class AuthModule {}
