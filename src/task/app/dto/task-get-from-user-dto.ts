import { Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';

class DateRange {
  @Type(() => Date)
  startDate: Date;

  @Type(() => Date)
  endDate: Date;
}

export class TaskGetFromUserDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => DateRange)
  range?: DateRange;
}
