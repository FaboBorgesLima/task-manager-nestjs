import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
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
    return (await this.userRepository.findAll()).map((user) => user.toJSON());
  }

  @Post('/')
  public async create(@Body() userCreateDto: UserCreateDto) {
    let user = User.create(
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
      throw new Error('User not found');
    }

    return user.toJSON();
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
      throw new Error('Needs auth token');
    }

    if (!user) {
      throw new Error('User not found');
    }

    if (userUpdateDto.name) {
      user.setName(userUpdateDto.name, requestUser);
    }

    if (userUpdateDto.password) {
      user.setPassword(userUpdateDto.password, requestUser);
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
      throw new Error('Needs auth token');
    }

    if (!user) {
      throw new Error('User not found');
    }

    if (!user.canUpdate(requestUser)) {
      throw new Error('User not authorized to delete');
    }

    return await this.userRepository.deleteOne(id);
  }
}
