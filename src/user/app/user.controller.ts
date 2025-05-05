import {
  Body,
  Controller,
  Delete,
  forwardRef,
  Get,
  Headers,
  HttpException,
  HttpStatus,
  Inject,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UserServiceInterface } from '../domain/user.service';
import { User } from '../domain/user';
import { UserCreateDto } from './dto/user-create-dto';
import { UserUpdateDto } from './dto/user-update-dto';
import { AbstractAuthService } from '../../auth/domain/abstract-auth.service';
import { UserHttpAdapter } from '../domain/user.http-adapter';
import { UserByIdPipe } from '../../user-by-id/user-by-id.pipe';
import { HashServiceInterface } from '../../hash/domain/hash.service.interface';

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

  @Post('/')
  public async create(@Body() userCreateDto: UserCreateDto) {
    const user = User.create(userCreateDto, this.hashService);

    const savedUser = await this.userService.saveOne(user);

    return this.authService.toTokenAndUser(savedUser);
  }

  @Get(':id')
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

  @Put(':id')
  public async update(
    @Param('id', UserByIdPipe) user: User,
    @Body() userUpdateDto: UserUpdateDto,
    @Headers('Authorization') authorization: string,
  ) {
    const requestUser = await this.authService.getUserFromHeader(authorization);

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
