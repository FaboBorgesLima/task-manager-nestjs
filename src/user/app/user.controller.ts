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
} from '@nestjs/common';
import { UserServiceInterface } from '../domain/user.service';
import { User } from '../domain/user';
import { UserCreateDto } from './dto/user-create-dto';
import { UserUpdateDto } from './dto/user-update-dto';
import { AuthServiceInterface } from '../../auth/domain/auth.service.interface';

@Controller('users')
export class UserController {
  constructor(
    @Inject(UserServiceInterface)
    private readonly userService: UserServiceInterface,
    @Inject(AuthServiceInterface)
    private readonly authService: AuthServiceInterface,
  ) {}

  @Get('/')
  public async findAll() {
    return {
      users: (await this.userService.findAll()).map((user) =>
        user.toJSONProfile(),
      ),
    };
  }

  @Post('/')
  public async create(@Body() userCreateDto: UserCreateDto) {
    const user = User.create(
      userCreateDto.name,
      userCreateDto.email,
      userCreateDto.password,
    );

    const savedUser = await this.userService.saveOne(user);

    return this.authService.toTokenAndUser(savedUser);
  }

  @Get(':id')
  public async findOne(@Param('id') id: string) {
    const user = await this.userService.findOne(id);

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return user.toJSONProfile();
  }

  @Put(':id')
  public async update(
    @Param('id') id: string,
    @Body() userUpdateDto: UserUpdateDto,
    @Headers('authorization') token: string,
  ) {
    const [user, requestUser] = await Promise.all([
      this.userService.findOne(id),
      this.authService.getUserFromToken(token),
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

    if (userUpdateDto.password) {
      user.changePassword(userUpdateDto.password, requestUser);
    }

    return await this.userService.saveOne(user);
  }

  @Delete(':id')
  public async delete(
    @Param('id') id: string,
    @Headers('authorization') token: string,
  ) {
    const [requestUser, user] = [
      await this.authService.getUserFromToken(token),
      await this.userService.findOne(id),
    ];

    if (!requestUser) {
      throw new HttpException('Needs auth token', HttpStatus.UNAUTHORIZED);
    }

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    if (!user.canUpdate(requestUser)) {
      throw new HttpException(
        'User not authorized to delete',
        HttpStatus.FORBIDDEN,
      );
    }

    return await this.userService.deleteOne(id);
  }
}
