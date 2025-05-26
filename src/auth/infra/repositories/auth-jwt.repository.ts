import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import {
  Auth,
  AuthRepositoryInterface,
} from '@faboborgeslima/task-manager-domain/auth';
import { User } from '@faboborgeslima/task-manager-domain/user';
import { JwtService } from '@nestjs/jwt';
import { AuthCredentials } from '@faboborgeslima/task-manager-domain/auth/types';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../../../user/infra/user.entity';
import bcrypt from 'bcrypt';
import { UserAdapter } from '../../../user/infra/user-adapter';
import { UserResponseDto } from 'src/user/app/dtos/user-response-dto';

@Injectable()
export class AuthJwtRespository implements AuthRepositoryInterface {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private jwtService: JwtService,
  ) {
    //
  }

  fromUser(user: User): Promise<Auth> {
    return Promise.resolve({
      user,
      token: this.jwtService.sign(UserAdapter.fromDomain(user).toResponseDTO()),
    });
  }

  async login(validate: AuthCredentials): Promise<Auth> {
    const user = await this.userRepository.findOneBy({
      email: validate.email,
    });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isPasswordValid = await bcrypt.compare(
      validate.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return { token: '', user: UserAdapter.fromPersistence(user).toDomain() };
  }

  async register(
    user: User,
    validate: AuthCredentials,
  ): Promise<{ token: string; user: User }> {
    const userEntity = UserAdapter.fromDomain(user).toPersistence();
    userEntity.password = await bcrypt.hash(validate.password, 10);
    await this.userRepository.save(userEntity);

    const token = this.jwtService.sign(
      UserAdapter.fromPersistence(userEntity).toResponseDTO(),
    );
    const userDomain = UserAdapter.fromPersistence(userEntity).toDomain();

    return { token, user: userDomain };
  }

  fromToken(token: string): Promise<Auth> {
    if (!token) {
      throw new BadRequestException('Token is required');
    }
    const tokenParts = token.split(' ');
    if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
      throw new BadRequestException('Invalid token format');
    }
    const jwtToken = tokenParts[1];
    const decoded = this.jwtService.verify<UserResponseDto>(jwtToken);

    return Promise.resolve({
      user: UserAdapter.fromResponseDTO(decoded).toDomain(),
      token: jwtToken,
    });
  }
}
