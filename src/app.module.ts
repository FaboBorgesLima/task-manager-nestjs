import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/app/user.module';
import { HashMaker } from './hash-maker/hash-maker';
import { TokenGenerator } from './token-generator/token-generator';
import TypeOrmModule from './database/typeorm.module';

@Module({
  imports: [UserModule, TypeOrmModule],
  controllers: [AppController],
  providers: [AppService, HashMaker, TokenGenerator],
})
export class AppModule {}
