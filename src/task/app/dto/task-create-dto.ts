import { TaskCreateInterface } from 'src/task/domain/interfaces/task-create.interface';
import { TaskStatus } from 'src/task/domain/task-status.enum';
import { IsDate, IsEnum, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class TaskCreateDTO implements TaskCreateInterface {
  @IsString()
  public title: string;
  @IsString()
  public description: string;
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  public dueDate: Date;
  @IsEnum(TaskStatus)
  public status: TaskStatus;
  @IsString()
  @IsOptional()
  public userId: string;
}
