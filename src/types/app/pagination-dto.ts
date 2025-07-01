import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, Min } from 'class-validator';

export class PaginationDto {
  @IsInt()
  @Min(0)
  @IsNotEmpty()
  @ApiProperty({
    type: Number,
    description: 'Page number for pagination',
    example: 0,
    default: 0,
  })
  page: number;

  @IsInt()
  @IsNotEmpty()
  @Min(1)
  @ApiProperty({
    type: Number,
    description: 'Number of items per page',
    example: 10,
    default: 10,
  })
  size: number;
}
