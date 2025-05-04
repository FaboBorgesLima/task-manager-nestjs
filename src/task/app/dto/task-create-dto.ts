import { TaskCreateProps } from '../../domain/types/task-create-props';
import { TaskStatus } from '../../domain/task-status.enum';
import { IsDate, IsEnum, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class TaskCreateDTO implements TaskCreateProps {
  @ApiProperty()
  @IsString()
  public title: string;

  @ApiProperty()
  @IsString()
  public description: string;

  @ApiProperty()
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  public dueDate: Date;

  @ApiProperty()
  @IsEnum(TaskStatus)
  @IsOptional()
  public status?: TaskStatus;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public userId: string;
}
