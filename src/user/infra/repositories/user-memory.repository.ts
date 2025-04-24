import { Injectable } from '@nestjs/common';
import { User } from '../../domain/user';
import { UserRepository } from '../../domain/user.repository';
import { randomUUID } from 'crypto';

@Injectable()
export class UserMemoryRepository implements UserRepository {
  private static users: User[] = [];

  async saveOrFail(user: User): Promise<User> {
    const savedUser = await this.saveOne(user);
    if (!savedUser) {
      throw new Error('User not saved');
    }
    return savedUser;
  }

  findByEmailPassword(email: string, password: string): Promise<User | void> {
    const user = UserMemoryRepository.users.find(
      (user) => user.getEmail() === email && user.getPassword() === password,
    );

    return Promise.resolve(user);
  }

  findAll(): Promise<User[]> {
    return Promise.resolve(UserMemoryRepository.users);
  }

  findOne(id: string): Promise<User | void> {
    const user = UserMemoryRepository.users.find((user) => user.id === id);
    return Promise.resolve(user);
  }

  saveOne(user: User): Promise<User | void> {
    const existingUserIndex = UserMemoryRepository.users.findIndex(
      (u) => u.id === user.id,
    );
    // If the user already exists, update it
    if (existingUserIndex !== -1) {
      UserMemoryRepository.users[existingUserIndex] = user;
    } else {
      user.id = randomUUID();
      UserMemoryRepository.users.push(user);
    }
    return Promise.resolve(user);
  }

  deleteOne(id: string): Promise<void> {
    UserMemoryRepository.users = UserMemoryRepository.users.filter(
      (user) => user.id !== id,
    );
    return Promise.resolve();
  }

  findByToken(token: string): Promise<User | void> {
    const user = UserMemoryRepository.users.find(
      (user) => user.token === token,
    );
    return Promise.resolve(user);
  }
}
