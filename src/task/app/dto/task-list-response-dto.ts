import { ApiProperty } from '@nestjs/swagger';
import { TaskJSON } from '../../infra/task-JSON';

export class TaskListResponseDto {
  @ApiProperty({ type: [TaskJSON] })
  tasks: TaskJSON[];
}
