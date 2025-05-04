import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { UserUpdateProps } from '../../domain/types/user-update-props';

export class UserUpdateDto implements UserUpdateProps {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  password: string;
}
