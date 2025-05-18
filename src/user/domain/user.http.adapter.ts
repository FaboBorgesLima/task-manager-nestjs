import { UserCreateProps } from './types/user-create-props';
import { UserUpdateProps } from './types/user-update-props';
import { User } from './user';

export interface UserHttpAdapter {
  findOne(id: string, authorization: string): Promise<User | null>;
  create(user: UserCreateProps): Promise<{ user: User; token: string }>;
  update(
    userId: string,
    userUpdateProps: UserUpdateProps,
    authorization: string,
  ): Promise<{ user: User; token: string }>;
  delete(id: string, authorization: string): Promise<void>;
}
