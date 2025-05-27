import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';
import { AuthCredentials } from '@faboborgeslima/task-manager-domain/auth/types';
import { UserCreateProps } from '@faboborgeslima/task-manager-domain/user/types';

export class AuthRegisterDto implements AuthCredentials, UserCreateProps {
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
  public email: string;

  @ApiProperty({
    description: 'User password',
    example: 'password123',
    required: true,
  })
  @IsString()
  public password: string;

  @ApiProperty({
    description: 'Validation string sended by email',
    example: '123456',
    default: '123456',
    required: true,
  })
  @IsString()
  public validation: string;
}
