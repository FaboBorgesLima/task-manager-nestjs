import { User } from '../domain/user';
import { UserEntity } from './user.entity';

export class UserEntityAdapter {
  protected constructor(protected user: User) {}

  public static fromDomain(user: User): UserEntityAdapter {
    return new UserEntityAdapter(user);
  }

  public toDomain(): User {
    return this.user;
  }

  public static fromPersistence(user: UserEntity): UserEntityAdapter {
    const userDomain = new User(
      user.name,
      user.email,
      user.password,
      user.token,
    );

    userDomain.id = user.id?.toString();
    return UserEntityAdapter.fromDomain(userDomain);
  }

  public toPersistence(): UserEntity {
    const userEntity = new UserEntity();
    userEntity.name = this.user.name;
    userEntity.email = this.user.getEmail();
    userEntity.password = this.user.getPassword();
    userEntity.token = this.user.token;
    if (this.user.id) {
      userEntity.id = this.user.id;
    }
    return userEntity;
  }
}
