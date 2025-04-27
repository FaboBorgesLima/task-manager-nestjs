import { User } from '../../user/domain/user';

export interface AuthServiceInterface {
  findByEmailPassword(email: string, password: string): Promise<User | void>;
  getUserFromToken(token: string): Promise<User | void>;
  toToken(user: User): Promise<string>;
  toTokenAndUser(
    user: User,
  ): Promise<{ token: string; user: ReturnType<User['toJSON']> }>;
}

export const AuthServiceInterface = Symbol('AuthServiceInterface');
