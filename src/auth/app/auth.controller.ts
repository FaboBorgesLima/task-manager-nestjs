import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpException,
  HttpStatus,
  Inject,
  Post,
} from '@nestjs/common';
import { AuthLoginDto } from './dto/auth-login.dto';
import { HashMaker } from '../../hash-maker/hash-maker';
import { AuthRepository } from '../domain/auth.repository';

@Controller('auth')
export class AuthController {
  public constructor(
    @Inject(AuthRepository) private readonly authRepository: AuthRepository,
    private readonly hashMaker: HashMaker,
  ) {}

  @Post('/login')
  public async login(@Body() body: AuthLoginDto) {
    const { email, password } = body;

    const user = await this.authRepository.findByEmailPassword(
      email,
      this.hashMaker.make(password),
    );

    if (!user) {
      throw new HttpException(
        'Invalid email or password',
        HttpStatus.UNAUTHORIZED,
      );
    }

    return user.toJSON();
  }

  @Delete('/logout')
  public logout() {}

  @Get('/me')
  public async me(@Headers('authorization') token: string) {
    const user = await this.authRepository.findByToken(token);
    if (!user) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
    return user.toJSON();
  }
}
