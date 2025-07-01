import { Inject, Injectable } from '@nestjs/common';
import {
  TaskService as DomainTaskService,
  TaskRepositoryInterface,
} from '@faboborgeslima/task-manager-domain/task';

@Injectable()
export class TaskService extends DomainTaskService {
  constructor(
    @Inject(TaskRepositoryInterface) taskRepository: TaskRepositoryInterface,
  ) {
    super(taskRepository);
  }
}
