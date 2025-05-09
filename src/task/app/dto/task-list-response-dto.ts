import { ApiProperty } from '@nestjs/swagger';
import { TaskResponseDto } from './task-response-dto';

export class TaskListResponseDto {
  @ApiProperty({ type: [TaskResponseDto] })
  tasks: TaskResponseDto[];
}
