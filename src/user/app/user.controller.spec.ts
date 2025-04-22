import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserMemoryRepository } from '../infra/repositories/user-memory.repository';
import { UserRepository } from '../domain/user.repository';

describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserRepository,
          useClass: UserMemoryRepository,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a user', async () => {
    const user = await controller.create({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password123',
    });

    if (!user) {
      throw new Error('User not created');
    }

    expect(user).toBeDefined();
    expect(user.getName()).toBe('John Doe');
    expect(user.getEmail()).toBe('john.doe@example.com');
    expect(user.getPassword()).not.toBe('password123');
    expect(user.id).toBeDefined();
    expect(user.token).toHaveLength(36);
  });

  it('should find all users', async () => {
    await controller.create({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password123',
    });
    const users = await controller.findAll();
    expect(users).toBeDefined();
    expect(users.length).toBe(1);
  });

  it('should find a user by id', async () => {
    await controller.create({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password123',
    });

    const users = await controller.findAll();
    const user = await controller.findOne(users[0].id as string);

    if (!user) {
      throw new Error('User not found');
    }

    expect(user).toBeDefined();
    expect(user.id).toBe(users[0].id);
  });
});
