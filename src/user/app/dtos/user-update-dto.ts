import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { UserUpdateProps } from '@faboborgeslima/task-manager-domain/user/types';

export class UserUpdateDto implements UserUpdateProps {
  @ApiProperty()
  @IsString()
  name: string;
}
