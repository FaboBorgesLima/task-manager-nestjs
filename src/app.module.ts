import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/app/user.module';
import { HashMaker } from './hash-maker/hash-maker';
import { TokenGenerator } from './token-generator/token-generator';
import { AuthModule } from './auth/app/auth.module';
import TypeOrmModule from './database/typeorm.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    TypeOrmModule,
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, HashMaker, TokenGenerator],
})
export class AppModule {}
