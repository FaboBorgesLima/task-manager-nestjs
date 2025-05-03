import { Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { SharedModule } from '../../shared/shared.module';
import { TaskServiceInterface } from '../domain/task.service.interface';
import { TaskTypeORMService } from '../infra/services/task-typorm.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskEntity } from '../infra/task.entity';

@Module({
  controllers: [TaskController],
  providers: [
    {
      provide: TaskServiceInterface,
      useClass: TaskTypeORMService,
    },
  ],
  imports: [TypeOrmModule.forFeature([TaskEntity]), SharedModule],
  exports: [
    {
      provide: TaskServiceInterface,
      useClass: TaskTypeORMService,
    },
  ],
})
export class TaskModule {}
