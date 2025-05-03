import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AbstractAuthService } from '../domain/abstract-auth.service';
import { AuthJwtService } from '../infra/services/auth-jwt.service';
import { HashMaker } from '../../hash-maker/hash-maker';
import { UserModule } from '../../user/app/user.module';
import { JwtConfigModule } from '../../jwt/jwt-config.module';

@Module({
  controllers: [AuthController],
  providers: [
    {
      provide: AbstractAuthService,
      useClass: AuthJwtService,
    },
    HashMaker,
  ],
  imports: [JwtConfigModule, UserModule],
  exports: [
    {
      provide: AbstractAuthService,
      useClass: AuthJwtService,
    },
    UserModule,
  ],
})
export class AuthModule {}
