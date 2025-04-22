import { Injectable } from '@nestjs/common';
import { User } from '../../domain/user';
import { UserRepository } from '../../domain/user.repository';
import { randomUUID } from 'crypto';

@Injectable()
export class UserMemoryRepository implements UserRepository {
  private users: User[] = [];

  findAll(): Promise<User[]> {
    return Promise.resolve(this.users);
  }

  findOne(id: string): Promise<User | void> {
    const user = this.users.find((user) => user.id === id);
    return Promise.resolve(user);
  }

  saveOne(user: User): Promise<User | void> {
    const existingUserIndex = this.users.findIndex((u) => u.id === user.id);
    // If the user already exists, update it
    if (existingUserIndex !== -1) {
      this.users[existingUserIndex] = user;
    } else {
      user.id = randomUUID();
      this.users.push(user);
    }
    return Promise.resolve(user);
  }

  deleteOne(id: string): Promise<void> {
    this.users = this.users.filter((user) => user.id !== id);
    return Promise.resolve();
  }

  findByToken(token: string): Promise<User | void> {
    const user = this.users.find((user) => user.token === token);
    return Promise.resolve(user);
  }
}
