import { User } from '../../user/domain/user';

export interface AuthRepository {
  findByEmailPassword(email: string, password: string): Promise<User | void>;
  findByToken(token: string): Promise<User | void>;
}

export const AuthRepository = Symbol('AuthRepository');
