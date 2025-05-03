import { DomainError } from '../../error/domain/domain-error';
import { User } from '../../user/domain/user';

export abstract class AbstractAuthService {
  protected getTokenFromHeader(authorization: string): string {
    if (!authorization) {
      throw new DomainError('Authorization header is missing');
    }
    const parts = authorization.split(' ');
    if (parts.length !== 2) {
      throw new DomainError('Invalid authorization header format');
    }

    const [type, token] = parts;

    if (type !== 'Bearer') {
      throw new DomainError('Invalid authorization type');
    }
    if (!token) {
      throw new DomainError('Token is missing');
    }
    return token;
  }

  public getUserFromHeader(authorization: string): Promise<User | void> {
    return this.getUserFromToken(this.getTokenFromHeader(authorization));
  }

  abstract findByEmailPassword(
    email: string,
    password: string,
  ): Promise<User | void>;
  abstract getUserFromToken(token: string): Promise<User | void>;
  abstract toToken(user: User): Promise<string>;
  abstract toTokenAndUser(
    user: User,
  ): Promise<{ token: string; user: ReturnType<User['toJSON']> }>;
}
