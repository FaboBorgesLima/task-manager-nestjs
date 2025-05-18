import { TaskCreateProps } from '@faboborgeslima/task-manager-domain/task/types';
import { TaskStatus } from '@faboborgeslima/task-manager-domain/task';
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
