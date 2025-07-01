import { IsInt, IsNotEmpty, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class OptionalDateRangePaginatedDto {
  @ApiProperty({
    type: Number,
    description: 'Page number for pagination',
    example: 0,
    default: 0,
  })
  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  page: number;

  @ApiProperty({
    type: Number,
    description: 'Number of items per page',
    example: 10,
    default: 10,
  })
  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  size: number;

  @ApiProperty({
    type: Date,
    description: 'End date of the range',
    example: '2023-10-01T00:00:00Z',
  })
  @Type(() => Date)
  @IsOptional()
  startDate?: Date;

  @ApiProperty({
    type: Date,
    description: 'End date of the range',
    example: '2023-10-01T00:00:00Z',
  })
  @Type(() => Date)
  @IsOptional()
  endDate?: Date;
}
