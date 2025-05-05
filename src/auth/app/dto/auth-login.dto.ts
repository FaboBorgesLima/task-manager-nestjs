import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';
import { AuthLoginProps } from '../../domain/types/auth-login-props';

export class AuthLoginDto implements AuthLoginProps {
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
