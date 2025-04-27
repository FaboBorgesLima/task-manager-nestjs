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
import { AuthServiceInterface } from '../domain/auth.service.interface';

@Controller('auth')
export class AuthController {
  public constructor(
    @Inject(AuthServiceInterface)
    private readonly authService: AuthServiceInterface,
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

  @Delete('/logout')
  public logout() {}

  @Get('/me')
  public async me(@Headers('authorization') token: string) {
    const user = await this.authService.getUserFromToken(token);
    if (!user) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
    return user.toJSON();
  }
}
