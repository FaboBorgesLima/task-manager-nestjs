import {
  Body,
  Controller,
  Get,
  Headers,
  HttpException,
  HttpStatus,
  Inject,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { AuthLoginDto } from './dtos/auth-login.dto';
import {
  ApiBodyUserTokenResponseInterceptor,
  UserTokenResponseInterceptor,
} from '../../user/app/interceptors/user-token-reponse.interceptor';
import {
  ApiBearerAuth,
  ApiBody,
  ApiHeaders,
  ApiResponse,
} from '@nestjs/swagger';
import { AuthService } from './services/auth.service';
import { User } from '@faboborgeslima/task-manager-domain/user';
import { AuthRegisterDto } from './dtos/auth-register.dto';
import { Auth } from '@faboborgeslima/task-manager-domain/auth';

@Controller('auth')
export class AuthController {
  public constructor(
    @Inject(AuthService)
    private readonly authService: AuthService,
  ) {}

  @Post('/login')
  @UseInterceptors(UserTokenResponseInterceptor)
  @ApiBody({
    description: 'Login user',
    type: AuthLoginDto,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User logged in successfully',
    type: ApiBodyUserTokenResponseInterceptor,
  })
  public async login(@Body() body: AuthLoginDto) {
    try {
      return await this.authService.login(body);
    } catch {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
  }

  @Post('/register')
  @UseInterceptors(UserTokenResponseInterceptor)
  @ApiBody({
    description: 'Register user',
    type: AuthRegisterDto,
  })
  public async register(@Body() body: AuthRegisterDto) {
    const user = new User(body);

    try {
      return await this.authService.register(user, body, body.validation);
    } catch {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
  }

  @UseInterceptors(UserTokenResponseInterceptor)
  @Get('/me')
  @ApiBearerAuth()
  @ApiHeaders([
    {
      name: 'Authorization',
      deprecated: true,
      required: false,
      allowEmptyValue: true,
    },
  ])
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User retrieved successfully',
    type: ApiBodyUserTokenResponseInterceptor,
  })
  public async me(
    @Headers('Authorization')
    authorization: string,
  ) {
    let auth: Auth;

    try {
      auth = await this.authService.fromToken(authorization);
    } catch {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    return auth;
  }
}
