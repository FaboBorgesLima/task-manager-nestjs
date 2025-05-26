import { Injectable } from '@nestjs/common';
import { User } from '@faboborgeslima/task-manager-domain/user';
import { UserRepositoryInterface } from '@faboborgeslima/task-manager-domain/user';
import { randomUUID } from 'crypto';

@Injectable()
export class UserMemoryRepository implements UserRepositoryInterface {
  private static users: User[] = [];

  constructor() {}

  findOne(id: string): Promise<User | void> {
    const user = UserMemoryRepository.users.find((user) => user.id === id);
    return Promise.resolve(user);
  }

  saveOne(user: User): Promise<User> {
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
}
