import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TaskController } from './task.controller';
import { SharedModule } from '../../shared/shared.module';
import { TaskRepositoryInterface } from 'task-manager-domain/task';
import { TaskTypeORMRepository } from '../infra/services/task-typorm.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskEntity } from '../infra/task.entity';
import { AuthMiddleware } from '../../auth/app/middlewares/auth.middleware';

@Module({
  controllers: [TaskController],
  providers: [
    {
      provide: TaskRepositoryInterface,
      useClass: TaskTypeORMRepository,
    },
  ],
  imports: [TypeOrmModule.forFeature([TaskEntity]), SharedModule],
  exports: [
    {
      provide: TaskRepositoryInterface,
      useClass: TaskTypeORMRepository,
    },
  ],
})
export class TaskModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(TaskController);
  }
}
