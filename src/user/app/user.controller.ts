import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpException,
  HttpStatus,
  Inject,
  Param,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { UserServiceInterface } from '../domain/user.service.interface';
import { User } from '../domain/user';
import { UserCreateDto } from './dto/user-create-dto';
import { UserUpdateDto } from './dto/user-update-dto';
import { AbstractAuthService } from '../../auth/domain/abstract-auth.service';
import { UserHttpAdapter } from '../domain/user.http.adapter';
import { UserByIdPipe } from '../../user-by-id/user-by-id.pipe';
import { HashServiceInterface } from '../../hash/domain/hash.service.interface';
import {
  ApiBodyUserResponseInterceptor,
  UserResponseInterceptor,
} from './interceptors/user-response.interceptor';
import { ApiBody, ApiParam } from '@nestjs/swagger';
import { UserResponseDto } from './dto/user-response-dto';
import {
  ApiBodyUserTokenResponseInterceptor,
  UserTokenResponseInterceptor,
} from './interceptors/user-token-reponse.interceptor';

@Controller('users')
export class UserController implements UserHttpAdapter {
  constructor(
    @Inject(UserServiceInterface)
    private readonly userService: UserServiceInterface,
    @Inject(AbstractAuthService)
    private readonly authService: AbstractAuthService,
    @Inject(HashServiceInterface)
    private readonly hashService: HashServiceInterface,
  ) {}

  @ApiBody({
    description: 'Create a new user',
    type: ApiBodyUserTokenResponseInterceptor,
  })
  @UseInterceptors(UserTokenResponseInterceptor)
  @Post('/')
  public async create(@Body() userCreateDto: UserCreateDto) {
    const user = User.create(userCreateDto, this.hashService);

    const savedUser = await this.userService.saveOne(user);

    return this.authService.toTokenAndUser(savedUser);
  }

  @Get(':id')
  @ApiBody({
    description: 'Get user by ID',
    type: ApiBodyUserResponseInterceptor,
  })
  @UseInterceptors(UserResponseInterceptor)
  public async findOne(
    @Param('id') id: string,
    @Headers('Authorization') authorization: string,
  ) {
    const [requestUser, user] = await Promise.all([
      this.authService.getUserFromHeader(authorization),
      this.userService.findOne(id),
    ]);
    if (!requestUser) {
      throw new HttpException('Needs auth token', HttpStatus.UNAUTHORIZED);
    }

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    if (!requestUser.canSee(user)) {
      throw new HttpException(
        'User not authorized to see',
        HttpStatus.FORBIDDEN,
      );
    }

    return user;
  }

  @ApiParam({
    name: 'id',
    description: 'User ID',
    required: true,
    type: String,
  })
  @ApiBody({
    description: 'Update user by ID',
    type: ApiBodyUserTokenResponseInterceptor,
  })
  @UseInterceptors(UserTokenResponseInterceptor)
  @Put(':id')
  public async update(
    @Param('id') userId: string,
    @Body() userUpdateDto: UserUpdateDto,
    @Headers('Authorization') authorization: string,
  ) {
    const [requestUser, user] = await Promise.all([
      this.authService.getUserFromHeader(authorization),
      this.userService.findOne(userId),
    ]);

    if (!requestUser) {
      throw new HttpException('Needs auth token', HttpStatus.UNAUTHORIZED);
    }

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    if (userUpdateDto.name) {
      user.setName(userUpdateDto.name, requestUser);
    }

    return this.authService.toTokenAndUser(
      await this.userService.saveOne(user),
    );
  }

  @Delete(':id')
  public async delete(
    @Param('id') id: string,
    @Headers('Authorization') authorization: string,
  ) {
    const [requestUser, user] = await Promise.all([
      this.authService.getUserFromHeader(authorization),
      this.userService.findOne(id),
    ]);

    if (!requestUser) {
      throw new HttpException('Needs auth token', HttpStatus.UNAUTHORIZED);
    }

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    if (!user.canDelete(requestUser)) {
      throw new HttpException(
        'User not authorized to delete',
        HttpStatus.FORBIDDEN,
      );
    }

    return await this.userService.deleteOne(id);
  }
}
