import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { AuthModule } from '../../auth/app/auth.module';

@Module({
  controllers: [UserController],
  providers: [],
  imports: [AuthModule],
  exports: [AuthModule],
})
export class UserModule {}
