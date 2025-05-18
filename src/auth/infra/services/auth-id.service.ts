import { Inject, Injectable } from '@nestjs/common';
import { AbstractAuthService } from 'task-manager-domain/auth';
import { UserRepositoryInterface, User } from 'task-manager-domain/user';

/**./../auth/domain/abstract-auth.service
 * DO NOT USE THIS CLASS IN PRODUCTION
 * This class is for testing purposes only.
 * It uses the user ID as the token.
 * This is not secure and should not be used in production.
 * Use AuthJwtService instead../../auth/domain/abstract-auth.service
 * @see AuthJwtService
 */
@Injectable()
export class AuthIdService extends AbstractAuthService {
  public constructor(
    @Inject(UserRepositoryInterface)
    private userService: UserRepositoryInterface,
  ) {
    super();
  }
  toToken(user: User): Promise<string> {
    if (!user.id) {
      throw new Error('User ID is required');
    }

    return Promise.resolve(user.id);
  }

  async toTokenAndUser(user: User): Promise<{ token: string; user: User }> {
    const token = await this.toToken(user);

    return { token, user: user };
  }

  public async getUserById(userId: string): Promise<User | void> {
    return this.userService.findOne(userId);
  }

  public async getUserFromToken(token: string): Promise<User | void> {
    return this.getUserById(token);
  }

  public findByEmailPassword(
    email: string,
    password: string,
  ): Promise<User | void> {
    return this.userService.findByEmailPassword(email, password);
  }
}
