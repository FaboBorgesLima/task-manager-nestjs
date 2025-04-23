import { User } from './user';

export interface UserRepository {
  findAll(): Promise<User[]>;
  findOne(id: string): Promise<User | void>;
  saveOne(user: User): Promise<User | void>;
  deleteOne(id: string): Promise<void>;
  findByToken(token: string): Promise<User | void>;
  saveOrFail(user: User): Promise<User>;
}

export const UserRepository = Symbol('UserRepository');
