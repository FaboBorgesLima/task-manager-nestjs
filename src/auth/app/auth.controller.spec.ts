import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { UserRepository } from '../../user/domain/user.repository';
import { UserMemoryRepository } from '../../user/infra/repositories/user-memory.repository';
import { HashMaker } from '../../hash-maker/hash-maker';
import { User } from '../../user/domain/user';
import { AuthRepository } from '../domain/auth.repository';
import { AuthUserRepository } from '../infra/auth-user.repository';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: UserRepository,
          useClass: UserMemoryRepository,
        },
        {
          provide: AuthRepository,
          useClass: AuthUserRepository,
        },
        HashMaker,
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should login a user', async () => {
    const userRepository = new UserMemoryRepository();

    await expect(
      controller.login({
        email: 'test@example.com',
        password: 'password123',
      }),
    ).rejects.toThrow();

    const user = User.create('John Doe', 'test@example.com', 'password123');
    await userRepository.saveOne(user);

    const loggedInUser = await controller.login({
      email: 'test@example.com',
      password: 'password123',
    });

    expect(loggedInUser).toBeDefined();
  });

  it('should return user from token', async () => {
    const userRepository = new UserMemoryRepository();
    const user = User.create('John Doe', 'test@testeee.com', 'password123');
    await userRepository.saveOne(user);

    const loggedInUser = await controller.login({
      email: 'test@testeee.com',
      password: 'password123',
    });
    expect(loggedInUser).toBeDefined();
    const userFromToken = await controller.me(loggedInUser.token);

    expect(userFromToken).toBeDefined();
    expect(userFromToken.email).toBe('test@testeee.com');
  });
});
