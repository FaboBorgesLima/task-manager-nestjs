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
import { AuthLoginDto } from './dto/auth-login.dto';
import { HashService } from '../../hash/app/hash.service';
import { AbstractAuthService } from '../domain/abstract-auth.service';
import { AuthHttpAdapter } from '../domain/auth.http-adapter';
import { HashServiceInterface } from '../../hash/domain/hash.service.interface';
import {
  ApiBodyUserTokenResponseInterceptor,
  UserTokenResponseInterceptor,
} from '../../user/app/interceptors/user-token-reponse.interceptor';
import { UserResponseInterceptor } from '../../user/app/interceptors/user-response.interceptor';
import {
  ApiBearerAuth,
  ApiBody,
  ApiHeader,
  ApiHeaders,
  ApiHideProperty,
  ApiResponse,
} from '@nestjs/swagger';

@Controller('auth')
export class AuthController implements AuthHttpAdapter {
  public constructor(
    @Inject(AbstractAuthService)
    private readonly authService: AbstractAuthService,
    @Inject(HashServiceInterface)
    private readonly hashMaker: HashService,
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

  @UseInterceptors(UserResponseInterceptor)
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
    const user = await this.authService.getUserFromHeader(authorization);
    if (!user) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    return user;
  }
}
