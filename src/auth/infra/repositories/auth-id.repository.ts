import { Inject, Injectable } from '@nestjs/common';
import {
  Auth,
  AuthRepositoryInterface,
} from '@faboborgeslima/task-manager-domain/auth';
import {
  UserRepositoryInterface,
  User,
} from '@faboborgeslima/task-manager-domain/user';
import { AuthCredentials } from '@faboborgeslima/task-manager-domain/auth/types';

/**
 * DO NOT USE THIS CLASS IN PRODUCTION
 *
 * This class is for testing purposes only.
 *
 * It uses the user ID as the token.
 *
 * This is not secure and should not be used in production.
 *
 */
@Injectable()
export class AuthIdRepository implements AuthRepositoryInterface {
  private static userAuthCredentials: {
    userId: string;
    credentials: AuthCredentials;
  }[] = [];
  public constructor(
    @Inject(UserRepositoryInterface)
    private userService: UserRepositoryInterface,
  ) {
    //
  }
  fromUser(user: User): Promise<Auth> {
    return Promise.resolve({
      token: user.id || '',
      user,
    });
  }

  async login(
    validate: AuthCredentials,
  ): Promise<{ token: string; user: User }> {
    const authenticatedUser = AuthIdRepository.userAuthCredentials.find(
      (credential) =>
        credential.credentials.email === validate.email &&
        credential.credentials.password === validate.password,
    );

    if (!authenticatedUser) {
      throw new Error('Invalid credentials');
    }
    const user = await this.userService.findOne(authenticatedUser.userId);
    if (!user) {
      throw new Error('User not found');
    }

    return {
      token: authenticatedUser.userId,
      user,
    };
  }

  async register(
    user: User,
    validate: AuthCredentials,
  ): Promise<{ token: string; user: User }> {
    const existingUser = AuthIdRepository.userAuthCredentials.find(
      (credential) => credential.credentials.email === validate.email,
    );

    if (existingUser) {
      throw new Error('User already exists');
    }

    const newUser = await this.userService.saveOne(user);
    if (!newUser) {
      throw new Error('User not found');
    }

    AuthIdRepository.userAuthCredentials.push({
      userId: newUser.id || '',
      credentials: {
        email: validate.email,
        password: validate.password,
      },
    });

    return {
      token: newUser.id || '',
      user: newUser,
    };
  }

  async fromToken(token: string): Promise<Auth> {
    const user = AuthIdRepository.userAuthCredentials.find(
      (credential) => credential.userId === token,
    );

    if (!user) {
      throw new Error('User not found');
    }

    const foundUser = await this.userService.findOne(user.userId);

    if (!foundUser) {
      throw new Error('User not found');
    }

    return { token: token, user: foundUser };
  }
}
