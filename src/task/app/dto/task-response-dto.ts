import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TaskStatus } from 'task-manager-domain/task';

export class TaskResponseDto {
  @ApiProperty({
    description: 'The unique identifier of the task',
    example: '1',
  })
  id: string;

  @ApiProperty({
    description: 'The title of the task',
    example: 'Task Title',
  })
  title: string;

  @ApiProperty({
    description: 'The title of the task',
    example: 'Task Title',
  })
  @ApiPropertyOptional()
  description?: string;

  @ApiProperty({
    description: 'The start date of the task',
    example: '2023-10-01T00:00:00Z',
  })
  start: Date;

  @ApiProperty({
    description: 'The end date of the task',
    example: '2023-10-01T00:00:00Z',
  })
  end: Date;

  @ApiProperty({
    enum: TaskStatus,
    default: TaskStatus.PENDING,
    description: 'The status of the task',
    example: TaskStatus.PENDING,
  })
  status: TaskStatus;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  userId: string;

  constructor(init: Partial<TaskResponseDto>) {
    Object.assign(this, init);
  }
}
