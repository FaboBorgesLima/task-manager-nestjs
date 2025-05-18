import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Task } from '@faboborgeslima/task-manager-domain/task';
import { TaskResponseDto } from '../dto/task-response-dto';
import { map, Observable } from 'rxjs';
import { TaskAdapter } from '../../infra/task-adapter';

export class TaskListResponseInterceptor
  implements NestInterceptor<Task[], TaskResponseDto[]>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler<Task[]>,
  ): Observable<TaskResponseDto[]> {
    return next
      .handle()
      .pipe(
        map((data) =>
          data.map((task) => TaskAdapter.fromDomain(task).toResponseDto()),
        ),
      );
  }
}
