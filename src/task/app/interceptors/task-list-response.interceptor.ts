import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Task } from '@faboborgeslima/task-manager-domain/task';
import { map, Observable } from 'rxjs';
import { TaskAdapter } from '../../infra/task-adapter';
import { TaskListResponseDto } from '../dto/task-list-response-dto';

export class TaskListResponseInterceptor
  implements NestInterceptor<Task[], TaskListResponseDto>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler<Task[]>,
  ): Observable<TaskListResponseDto> {
    return next.handle().pipe(
      map((data) => ({
        tasks: data.map((task) => TaskAdapter.fromDomain(task).toResponseDto()),
      })),
    );
  }
}
