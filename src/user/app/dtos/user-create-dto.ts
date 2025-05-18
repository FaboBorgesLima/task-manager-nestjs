import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';
import { UserCreateProps } from '@faboborgeslima/task-manager-domain/user/types';

export class UserCreateDto implements UserCreateProps {
  @ApiProperty({
    description: 'User name',
    example: 'John Doe',
    required: true,
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
    required: true,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User password',
    example: 'password123',
    required: true,
  })
  @IsString()
  password: string;
}
