import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';
import { AuthCredentials } from '@faboborgeslima/task-manager-domain/auth/types';

export class AuthLoginDto implements AuthCredentials {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
    required: true,
  })
  @IsEmail()
  public email: string;

  @ApiProperty({
    description: 'User password',
    example: 'password123',
    required: true,
  })
  @IsString()
  public password: string;
}
