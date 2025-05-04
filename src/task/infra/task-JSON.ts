import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TaskStatus } from '../domain/task-status.enum';

export class TaskJSON {
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
    description: 'The due date of the task',
    example: '2023-10-01T00:00:00.000Z',
  })
  dueDate: Date;

  @ApiProperty({
    enum: TaskStatus,
    enumName: 'TaskStatus',
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

  constructor(init: Partial<TaskJSON>) {
    Object.assign(this, init);
  }
}
