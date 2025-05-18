import { User } from '@faboborgeslima/task-manager-domain/user';
import { AuthToken } from './auth-token';

export class AuthTokenUserAdapter {
  protected constructor(protected user: User) {}

  public static fromDomain(user: User): AuthTokenUserAdapter {
    return new AuthTokenUserAdapter(user);
  }

  public toDomain(): User {
    return this.user;
  }

  public static fromAuthToken(authToken: AuthToken): AuthTokenUserAdapter {
    const userDomain = new User({
      name: authToken.user.name,
      email: authToken.user.email,
      password: authToken.user.password,
      createdAt: authToken.user.createdAt,
      updatedAt: authToken.user.updatedAt,
    });

    userDomain.id = authToken.user.id?.toString();
    return AuthTokenUserAdapter.fromDomain(userDomain);
  }

  public toAuthToken(): AuthToken {
    const authToken: AuthToken = {
      user: {
        id: this.user.id || '',
        email: this.user.getEmail(),
        name: this.user.getName(),
        password: this.user.getPassword(),
        createdAt: this.user.getCreatedAt(),
        updatedAt: this.user.updatedAt,
      },
    };
    return authToken;
  }
}
