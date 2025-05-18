import { Injectable } from '@nestjs/common';
import { User } from '@faboborgeslima/task-manager-domain/user';
import { UserRepositoryInterface } from '@faboborgeslima/task-manager-domain/user';
import { randomUUID } from 'crypto';

@Injectable()
export class UserMemoryService implements UserRepositoryInterface {
  private static users: User[] = [];

  constructor() {}

  findByEmailPassword(email: string, password: string): Promise<User | void> {
    const user = UserMemoryService.users.find(
      (user) => user.getEmail() === email && user.getPassword() === password,
    );

    return Promise.resolve(user);
  }

  findAll(): Promise<User[]> {
    return Promise.resolve(UserMemoryService.users);
  }

  findOne(id: string): Promise<User | void> {
    const user = UserMemoryService.users.find((user) => user.id === id);
    return Promise.resolve(user);
  }

  saveOne(user: User): Promise<User> {
    const existingUserIndex = UserMemoryService.users.findIndex(
      (u) => u.id === user.id,
    );
    // If the user already exists, update it
    if (existingUserIndex !== -1) {
      UserMemoryService.users[existingUserIndex] = user;
    } else {
      user.id = randomUUID();
      UserMemoryService.users.push(user);
    }
    return Promise.resolve(user);
  }

  deleteOne(id: string): Promise<void> {
    UserMemoryService.users = UserMemoryService.users.filter(
      (user) => user.id !== id,
    );
    return Promise.resolve();
  }
}
