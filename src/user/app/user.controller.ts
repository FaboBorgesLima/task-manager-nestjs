import {
  Controller,
  Delete,
  Get,
  Headers,
  HttpException,
  HttpStatus,
  Inject,
  Param,
  UseInterceptors,
} from '@nestjs/common';
import { UserRepositoryInterface } from '@faboborgeslima/task-manager-domain/user';
import { AuthRepositoryInterface } from '@faboborgeslima/task-manager-domain/auth';
import { AuthService } from '../../auth/app/services/auth.service';
import { UserUpdateDto } from './dtos/user-update-dto';
import {
  ApiBodyUserResponseInterceptor,
  UserResponseInterceptor,
} from './interceptors/user-response.interceptor';
import { ApiBearerAuth, ApiBody, ApiParam, ApiResponse } from '@nestjs/swagger';
import { ApiBodyUserTokenResponseInterceptor } from './interceptors/user-token-reponse.interceptor';
import { BigIntPipe } from '../../big-int/big-int.pipe';

@Controller('users')
export class UserController {
  constructor(
    @Inject(UserRepositoryInterface)
    private readonly userService: UserRepositoryInterface,
    @Inject(AuthRepositoryInterface)
    private readonly authService: AuthService,
  ) {}

  @Get(':id')
  @ApiParam({
    name: 'id',
    description: 'User ID',
    required: true,
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User retrieved successfully',
    type: ApiBodyUserResponseInterceptor,
  })
  @ApiBearerAuth()
  @UseInterceptors(UserResponseInterceptor)
  public async findOne(
    @Param('id', BigIntPipe) id: string,
    @Headers('Authorization') authorization: string,
  ) {
    const [auth, user] = await Promise.all([
      this.authService.fromToken(authorization),
      this.userService.findOne(id),
    ]);
    if (!auth) {
      throw new HttpException('Needs auth token', HttpStatus.UNAUTHORIZED);
    }

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    if (!auth.user.canSee(user)) {
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
    type: UserUpdateDto,
  })
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User updated successfully',
    type: ApiBodyUserTokenResponseInterceptor,
  })
  @ApiParam({
    name: 'id',
    description: 'User ID',
    required: true,
    type: String,
  })
  @ApiBearerAuth()
  @Delete(':id')
  public async delete(
    @Param('id', BigIntPipe) id: string,
    @Headers('Authorization') authorization: string,
  ) {
    const [auth, user] = await Promise.all([
      this.authService.fromToken(authorization),
      this.userService.findOne(id),
    ]);

    if (!auth) {
      throw new HttpException('Needs auth token', HttpStatus.UNAUTHORIZED);
    }

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    if (!auth.user.canDelete(user)) {
      throw new HttpException(
        'User not authorized to delete',
        HttpStatus.FORBIDDEN,
      );
    }

    return await this.userService.deleteOne(id);
  }
}
