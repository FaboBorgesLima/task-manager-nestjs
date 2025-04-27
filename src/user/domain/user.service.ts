import { User } from './user';

export interface UserServiceInterface {
  findAll(): Promise<User[]>;
  findOne(id: string): Promise<User | void>;
  saveOne(user: User): Promise<User | void>;
  deleteOne(id: string): Promise<void>;
  saveOrFail(user: User): Promise<User>;
  findByEmailPassword(email: string, password: string): Promise<User | void>;
}

export const UserServiceInterface = Symbol('UserServiceInterface');
