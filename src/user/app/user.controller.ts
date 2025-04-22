import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
} from '@nestjs/common';
import { UserRepository } from '../domain/user.repository';
import { User } from '../domain/user';
import { UserCreateDto } from './dto/user-create-dto';

@Controller('users')
export class UserController {
  constructor(
    @Inject(UserRepository) private readonly userRepository: UserRepository,
  ) {}
  @Get('/')
  public async findAll() {
    return await this.userRepository.findAll();
  }

  @Post('/')
  public async create(@Body() userCreateDto: UserCreateDto) {
    const user = User.create(
      userCreateDto.name,
      userCreateDto.email,
      userCreateDto.password,
    );

    return await this.userRepository.saveOne(user);
  }

  @Get(':id')
  public async findOne(@Param('id') id: string) {
    return await this.userRepository.findOne(id);
  }

  @Post(':id')
  public async update(
    @Param('id') id: string,
    @Body() userCreateDto: UserCreateDto,
  ) {
    const user = User.create(
      userCreateDto.name,
      userCreateDto.email,
      userCreateDto.password,
    );
    user.id = id;

    return await this.userRepository.saveOne(user);
  }

  @Delete(':id')
  public async delete(@Param('id') id: string) {
    return await this.userRepository.deleteOne(id);
  }
}
