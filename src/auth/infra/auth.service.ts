import { Inject, Injectable } from '@nestjs/common';
import { AuthServiceInterface } from '../domain/auth.service.interface';
import { UserServiceInterface } from '../../user/domain/user.service';
import { User } from 'src/user/domain/user';
import { JwtService } from '@nestjs/jwt';
import { AuthTokenUserAdapter } from './auth-token-user-adapter';
import { AuthToken } from './auth-token';

@Injectable()
export class AuthService implements AuthServiceInterface {
  constructor(
    @Inject(UserServiceInterface) private userService: UserServiceInterface,
    private jwtService: JwtService,
  ) {
    //
  }
  async toTokenAndUser(
    user: User,
  ): Promise<{ token: string; user: ReturnType<User['toJSON']> }> {
    const token = await this.toToken(user);
    return { token, user: user.toJSON() };
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
