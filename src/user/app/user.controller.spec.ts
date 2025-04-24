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
    expect(user.name).toBe('John Doe');
    expect(user.email).toBe('john.doe@example.com');
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
    expect(users.length).toBeGreaterThanOrEqual(1);
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

  it('should update a user', async () => {
    let { id, token } = await controller.create({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password123',
    });

    id = id as string;

    const updatedUser = await controller.update(
      id,
      {
        name: 'Jane Doe',
        password: 'newpassword123',
      },
      token,
    );

    if (!updatedUser) {
      throw new Error('User not updated');
    }

    expect(updatedUser.getName()).toBe('Jane Doe');
    expect(updatedUser.getPassword()).not.toBe('newpassword123');
  });

  it('should delete a user', async () => {
    const { id, token } = await controller.create({
      name: 'John Doe',
      email: 'joe@example.com',
      password: 'password123',
    });
    if (!id) {
      throw new Error('User not created');
    }

    await controller.delete(id, token);
  });
});
