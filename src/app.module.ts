import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/app/user.module';
import { AuthModule } from './auth/app/auth.module';
import { TaskModule } from './task/app/task.module';
import { SharedModule } from './shared/shared.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { DomainErrorInterceptor } from './error/app/domain-error-interceptor';

@Module({
  imports: [SharedModule, UserModule, AuthModule, TaskModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: DomainErrorInterceptor,
    },
  ],
})
export class AppModule {}
