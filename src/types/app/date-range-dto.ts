import { ApiProperty } from '@nestjs/swagger';
import { DateRange } from '../domain/date-range';
import { IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class DateRangeDto implements DateRange {
  @ApiProperty({
    type: Date,
    description: 'End date of the range',
    example: '2023-10-01T00:00:00Z',
  })
  @Type(() => Date)
  startDate: Date;

  @ApiProperty({
    type: Date,
    description: 'End date of the range',
    example: '2023-10-01T00:00:00Z',
  })
  @Type(() => Date)
  endDate: Date;
}
