import {
  Body,
  Controller,
  Get,
  Headers,
  HttpException,
  HttpStatus,
  Inject,
  Post,
} from '@nestjs/common';
import { AuthLoginDto } from './dto/auth-login.dto';
import { HashMaker } from '../../hash-maker/hash-maker';
import { AbstractAuthService } from '../domain/abstract-auth.service';

@Controller('auth')
export class AuthController {
  public constructor(
    @Inject(AbstractAuthService)
    private readonly authService: AbstractAuthService,
    private readonly hashMaker: HashMaker,
  ) {}

  @Post('/login')
  public async login(@Body() body: AuthLoginDto) {
    const { email, password } = body;

    const user = await this.authService.findByEmailPassword(
      email,
      this.hashMaker.make(password),
    );

    if (!user) {
      throw new HttpException(
        'Invalid email or password',
        HttpStatus.UNAUTHORIZED,
      );
    }

    return this.authService.toTokenAndUser(user);
  }

  @Get('/me')
  public async me(@Headers('authorization') authorization: string) {
    const user = await this.authService.getUserFromHeader(authorization);
    if (!user) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
    return user.toJSON();
  }
}
