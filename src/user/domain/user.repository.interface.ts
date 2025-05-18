import { User } from './user';

export interface UserRepositoryInterface {
  findAll(): Promise<User[]>;
  findOne(id: string): Promise<User | void>;
  saveOne(user: User): Promise<User>;
  deleteOne(id: string): Promise<void>;
  findByEmailPassword(email: string, password: string): Promise<User | void>;
}

export const UserRepositoryInterface = Symbol('UserRepositoryInterface');
