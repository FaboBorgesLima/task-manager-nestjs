import { TaskCreateProps } from '../../domain/types/task-create-props';
import { TaskStatus } from '../../domain/task-status.enum';
import { IsDate, IsEnum, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class TaskCreateDTO implements TaskCreateProps {
  @ApiProperty()
  @IsString()
  public title: string;

  @ApiProperty()
  @IsString()
  public description: string;

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  public start: Date;

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  public end: Date;

  @ApiPropertyOptional({
    enum: TaskStatus,
    default: TaskStatus.PENDING,
  })
  @IsEnum(TaskStatus)
  @IsOptional()
  public status?: TaskStatus;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public userId: string;
}
