import { BadRequestException, Injectable } from '@nestjs/common';
import {
  User,
  UserRepositoryInterface,
} from '@faboborgeslima/task-manager-domain/user';
import { Repository } from 'typeorm';
import { UserEntity } from '../user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserAdapter } from '../user-adapter';

@Injectable()
export class UserTypeORMService implements UserRepositoryInterface {
  public constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  private isBigInt(value: string): boolean {
    try {
      BigInt(value);
      return true;
    } catch {
      return false;
    }
  }

  async findOne(id: string): Promise<User | void> {
    if (!id) {
      return;
    }

    if (!this.isBigInt(id)) {
      throw new BadRequestException('Invalid ID format');
    }

    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      return;
    }
    return UserAdapter.fromPersistence(user).toDomain();
  }

  async saveOne(user: User): Promise<User> {
    const userEntity = UserAdapter.fromDomain(user).toPersistence();
    await this.userRepository.save(userEntity);
    return UserAdapter.fromPersistence(userEntity).toDomain();
  }

  async deleteOne(id: string): Promise<void> {
    if (!id || !this.isBigInt(id)) {
      return;
    }

    await this.userRepository.delete(id);
  }

  async findAll(): Promise<User[]> {
    const users = await this.userRepository.find();
    return users.map((user) => UserAdapter.fromPersistence(user).toDomain());
  }

  async findByEmailPassword(
    email: string,
    password: string,
  ): Promise<User | void> {
    const user = await this.userRepository.findOneBy({
      email,
      password,
    });

    if (!user) {
      return;
    }

    return UserAdapter.fromPersistence(user).toDomain();
  }
}
