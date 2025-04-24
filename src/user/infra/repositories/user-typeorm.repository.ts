import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../domain/user.repository';
import { User } from '../../domain/user';
import { Repository } from 'typeorm';
import { UserEntity } from '../user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntityAdapter } from '../user-entity-adapter';

@Injectable()
export class UserTypeORMRepository implements UserRepository {
  public constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async findOne(id: string): Promise<User | void> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      return;
    }
    return UserEntityAdapter.fromPersistence(user).toDomain();
  }

  async saveOne(user: User): Promise<User> {
    const userEntity = UserEntityAdapter.fromDomain(user).toPersistence();
    await this.userRepository.save(userEntity);
    return UserEntityAdapter.fromPersistence(userEntity).toDomain();
  }

  async saveOrFail(user: User): Promise<User> {
    const savedUser = await this.saveOne(user);
    if (!savedUser) {
      throw new Error('User not saved');
    }
    return savedUser;
  }

  async deleteOne(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }

  async findAll(): Promise<User[]> {
    const users = await this.userRepository.find();
    return users.map((user) =>
      UserEntityAdapter.fromPersistence(user).toDomain(),
    );
  }

  async findByToken(token: string): Promise<User | void> {
    const user = await this.userRepository.findOneBy({ token });
    if (!user) {
      return;
    }
    return UserEntityAdapter.fromPersistence(user).toDomain();
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

    return UserEntityAdapter.fromPersistence(user).toDomain();
  }
}
