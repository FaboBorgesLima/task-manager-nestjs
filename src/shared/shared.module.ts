import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/app/auth.module';
import TypeormModule from '../database/typeorm.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeormModule,
    AuthModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
  ],
  controllers: [],
  providers: [],
  exports: [
    TypeormModule,
    AuthModule,
    ConfigModule,
    // Add any other shared services or modules here
  ],
})
export class SharedModule {}
