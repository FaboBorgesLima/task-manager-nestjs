import { Type } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { TaskUpdateInterface } from '../../domain/interfaces/task-update.interface';
import { TaskStatus } from '../../domain/task-status.enum';

export class TaskUpdateDto implements TaskUpdateInterface {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @Type(() => Date)
  @IsOptional()
  dueDate?: Date;
}
