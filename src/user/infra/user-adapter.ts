import { UserResponseDto } from '../app/dtos/user-response-dto';
import { User } from '@faboborgeslima/task-manager-domain/user';
import { UserEntity } from './user.entity';

export class UserAdapter {
  protected constructor(protected user: User) {}

  public static fromDomain(user: User): UserAdapter {
    return new UserAdapter(user);
  }

  public toDomain(): User {
    return this.user;
  }

  public toResponseDTO(): UserResponseDto {
    if (!this.user.id) {
      throw new Error('User ID is not set');
    }

    return {
      id: this.user.id,
      name: this.user.name,
      email: this.user.email,
      createdAt: this.user.createdAt,
      updatedAt: this.user.updatedAt,
    };
  }

  public static fromResponseDTO(user: UserResponseDto): UserAdapter {
    const userDomain = new User({
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });

    return UserAdapter.fromDomain(userDomain);
  }

  public static fromPersistence(user: UserEntity): UserAdapter {
    const userDomain = new User({
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });

    userDomain.id = user.id?.toString();
    return UserAdapter.fromDomain(userDomain);
  }

  public toPersistence(): UserEntity {
    const userEntity = new UserEntity();
    userEntity.name = this.user.name;
    userEntity.email = this.user.email;
    userEntity.createdAt = this.user.createdAt;
    userEntity.updatedAt = this.user.updatedAt;
    if (this.user.id) {
      userEntity.id = this.user.id;
    }
    return userEntity;
  }
}
