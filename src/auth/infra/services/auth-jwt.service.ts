import { Inject, Injectable } from '@nestjs/common';
import { AbstractAuthService } from '../../domain/abstract-auth.service';
import { UserRepositoryInterface } from '../../../user/domain/user.repository.interface';
import { User } from '../../../user/domain/user';
import { JwtService } from '@nestjs/jwt';
import { AuthTokenUserAdapter } from '../auth-token-user-adapter';
import { AuthToken } from '../auth-token';

@Injectable()
export class AuthJwtService extends AbstractAuthService {
  constructor(
    @Inject(UserRepositoryInterface)
    private userService: UserRepositoryInterface,
    private jwtService: JwtService,
  ) {
    super();
  }
  async toTokenAndUser(user: User): Promise<{ token: string; user: User }> {
    const token = await this.toToken(user);
    return { token, user: user };
  }

  async getUserFromToken(token: string): Promise<User | void> {
    const payload = await this.jwtService.verifyAsync<AuthToken>(token);
    if (!payload) {
      return;
    }
    return AuthTokenUserAdapter.fromAuthToken(payload).toDomain();
  }

  async toToken(user: User): Promise<string> {
    const payload = AuthTokenUserAdapter.fromDomain(user).toAuthToken();
    return this.jwtService.signAsync(payload);
  }

  async findByEmailPassword(email: string, password: string) {
    return this.userService.findByEmailPassword(email, password);
  }
}
