import { ApiProperty } from '@nestjs/swagger';
import { DateRange } from '../domain/date-range';
import { IsDate } from 'class-validator';

export class DateRangeDto implements DateRange {
  @IsDate()
  @ApiProperty({
    type: Date,
    description: 'End date of the range',
    example: '2023-10-01T00:00:00Z',
  })
  startDate: Date;

  @IsDate()
  @ApiProperty({
    type: Date,
    description: 'End date of the range',
    example: '2023-10-01T00:00:00Z',
  })
  endDate: Date;
}
