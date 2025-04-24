import { IsEmail, IsString } from 'class-validator';

export class AuthLoginDto {
  @IsEmail()
  public email: string;

  @IsString()
  public password: string;
}
