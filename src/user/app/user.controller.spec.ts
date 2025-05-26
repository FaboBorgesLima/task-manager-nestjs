import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserMemoryRepository } from '../infra/repositories/user-memory.repository';
import {
  User,
  UserRepositoryInterface,
} from '@faboborgeslima/task-manager-domain/user';
import { AuthRepositoryInterface } from '@faboborgeslima/task-manager-domain/auth';
import { AuthIdRepository } from '../../auth/infra/repositories/auth-id.repository';
import { faker } from '@faker-js/faker';

describe('UserController', () => {
  let controller: UserController;
  const authRepository = new AuthIdRepository(new UserMemoryRepository());
  const userRepository: UserRepositoryInterface = new UserMemoryRepository();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: AuthRepositoryInterface,
          useValue: new AuthIdRepository(userRepository),
        },
        {
          provide: UserRepositoryInterface,
          useValue: userRepository,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should find a user by id', async () => {
    const { user, token } = await authRepository.register(
      new User({
        name: 'Test User',
        email: faker.internet.email(),
      }),
      {
        email: faker.internet.email(),
        password: 'password123',
      },
    );

    if (!user) {
      throw new Error('User not found');
    }

    const foundUser = await controller.findOne(user.id as string, token);

    if (!foundUser) {
      throw new Error('User not found');
    }

    expect(foundUser).toBeDefined();
    expect(foundUser.id).toBe(user.id as string);
  });

  it('should delete a user', async () => {
    const email = faker.internet.email();
    const { user, token } = await authRepository.register(
      new User({
        name: 'Test User',
        email: email,
      }),
      {
        email: email,
        password: 'password123',
      },
    );
    if (!user.id) {
      throw new Error('User not created');
    }

    await controller.delete(user.id, token);
  });
});
