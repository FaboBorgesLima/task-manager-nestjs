import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/app/auth.module';
import TypeormModule from '../database/typeorm.module';
import { ConfigModule } from '@nestjs/config';
import { EmailModule } from '../email/app/email.module';

@Module({
  imports: [
    TypeormModule,
    AuthModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    EmailModule,
  ],
  controllers: [],
  providers: [],
  exports: [
    TypeormModule,
    AuthModule,
    ConfigModule,
    EmailModule,
    // Add any other shared services or modules here
  ],
})
export class SharedModule {}
