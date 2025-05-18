import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ description: 'User ID', example: '1234567890' })
  id: string;

  @ApiProperty({ description: 'User name', example: 'John Doe' })
  name: string;

  @ApiProperty({ description: 'User email', example: 'john.doe@example.com' })
  email: string;

  @ApiProperty({
    description: 'Creation date of the user',
    example: '2023-01-01T00:00:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last updated date of the user',
    example: '2023-01-02T00:00:00Z',
  })
  updatedAt: Date;
}
