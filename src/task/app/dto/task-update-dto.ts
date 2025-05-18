import { Type } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { TaskUpdateProps } from '../../domain/types/task-update-props';
import { TaskStatus } from '../../domain/task-status.enum';
import { ApiProperty } from '@nestjs/swagger';

export class TaskUpdateDto implements TaskUpdateProps {
  @ApiProperty()
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ enum: TaskStatus, enumName: 'TaskStatus' })
  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @ApiProperty()
  @Type(() => Date)
  @IsOptional()
  start: Date;
  @ApiProperty()
  @Type(() => Date)
  @IsOptional()
  end: Date;
}
