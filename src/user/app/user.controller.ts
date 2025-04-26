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
import { UserRepository } from '../domain/user.repository';
import { User } from '../domain/user';
import { UserCreateDto } from './dto/user-create-dto';
import { UserUpdateDto } from './dto/user-update-dto';

@Controller('users')
export class UserController {
  constructor(
    @Inject(UserRepository) private readonly userRepository: UserRepository,
  ) {}
  @Get('/')
  public async findAll() {
    return (await this.userRepository.findAll()).map((user) =>
      user.toJSONProfile(),
    );
  }

  @Post('/')
  public async create(@Body() userCreateDto: UserCreateDto) {
    const user = User.create(
      userCreateDto.name,
      userCreateDto.email,
      userCreateDto.password,
    );

    return (await this.userRepository.saveOrFail(user)).toJSON();
  }

  @Get(':id')
  public async findOne(@Param('id') id: string) {
    const user = await this.userRepository.findOne(id);

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
      this.userRepository.findOne(id),
      this.userRepository.findByToken(token),
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
      user.changePasswordAndRandomizeToken(userUpdateDto.password, requestUser);
    }

    return await this.userRepository.saveOne(user);
  }

  @Delete(':id')
  public async delete(
    @Param('id') id: string,
    @Headers('authorization') token: string,
  ) {
    const [requestUser, user] = [
      await this.userRepository.findByToken(token),
      await this.userRepository.findOne(id),
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

    return await this.userRepository.deleteOne(id);
  }
}
