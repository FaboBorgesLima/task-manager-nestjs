import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class SendValidationDto {
  @IsEmail()
  @ApiProperty({
    description: 'The email address to send the validation code to',
    type: String,
  })
  email: string;
}
