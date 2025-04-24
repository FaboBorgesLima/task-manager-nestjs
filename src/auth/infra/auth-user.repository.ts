import { Inject, Injectable } from '@nestjs/common';
import { AuthRepository } from '../domain/auth.repository';
import { UserRepository } from '../../user/domain/user.repository';

@Injectable()
export class AuthUserRepository implements AuthRepository {
  constructor(@Inject(UserRepository) private userRepository: UserRepository) {
    //
  }

  async findByEmailPassword(email: string, password: string) {
    return this.userRepository.findByEmailPassword(email, password);
  }

  async findByToken(token: string) {
    return this.userRepository.findByToken(token);
  }
}
