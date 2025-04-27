import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserMemoryService } from '../infra/repositories/user-memory.service';
import { UserServiceInterface } from '../domain/user.service';
import { AuthServiceInterface } from '../../auth/domain/auth.service.interface';
import { AuthService } from '../../auth/infra/auth.service';
import { JwtModule } from '@nestjs/jwt';

describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: AuthServiceInterface,
          useClass: AuthService,
        },
        {
          provide: UserServiceInterface,
          useClass: UserMemoryService,
        },
      ],
      imports: [
        JwtModule.register({
          secret: 'test',
          signOptions: { expiresIn: '10d' },
        }),
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a user', async () => {
    const { user } = await controller.create({
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
  });

  it('should find all users', async () => {
    await controller.create({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password123',
    });
    const users = await controller.findAll();
    expect(users).toBeDefined();
    expect(users.users.length).toBeGreaterThanOrEqual(1);
  });

  it('should find a user by id', async () => {
    await controller.create({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password123',
    });

    const { users } = await controller.findAll();
    const userId = users[0].id as string;
    const user = await controller.findOne(userId);

    if (!user) {
      throw new Error('User not found');
    }

    expect(user).toBeDefined();
    expect(user.id).toBe(users[0].id as string);
  });

  it('should update a user', async () => {
    const { token, user } = await controller.create({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password123',
    });

    const userId = user.id as string;

    const updatedUser = await controller.update(
      userId,
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
    const { user, token } = await controller.create({
      name: 'John Doe',
      email: 'joe@example.com',
      password: 'password123',
    });
    if (!user.id) {
      throw new Error('User not created');
    }

    await controller.delete(user.id, token);
  });
});
