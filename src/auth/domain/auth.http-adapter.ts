import { User } from '../../user/domain/user';
import { AuthLoginProps } from './types/auth-login-props';

export interface AuthHttpAdapter {
  login(props: AuthLoginProps): Promise<{ user: User; token: string }>;
  me(authorization: string): Promise<User>;
}
