import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserMemoryService } from '../infra/services/user-memory.service';
import { UserRepositoryInterface } from '../domain/user.repository.interface';
import { AbstractAuthService } from '../../auth/domain/abstract-auth.service';
import { AuthJwtService } from '../../auth/infra/services/auth-jwt.service';
import { JwtModule } from '@nestjs/jwt';
import { HashServiceInterface } from '../../hash/domain/hash.service.interface';
import { HashMockService } from '../../hash/app/hash-mock.service';

describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: AbstractAuthService,
          useClass: AuthJwtService,
        },
        {
          provide: UserRepositoryInterface,
          useClass: UserMemoryService,
        },
        {
          provide: HashServiceInterface,
          useClass: HashMockService,
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

  it('should find a user by id', async () => {
    const { user, token } = await controller.create({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password123',
    });

    if (!user) {
      throw new Error('User not found');
    }

    const foundUser = await controller.findOne(
      user.id as string,
      `Bearer ${token}`,
    );

    if (!foundUser) {
      throw new Error('User not found');
    }

    expect(foundUser).toBeDefined();
    expect(foundUser.id).toBe(user.id as string);
  });

  it('should update a user', async () => {
    const { token, user } = await controller.create({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password123',
    });

    const updateResponse = await controller.update(
      user.id as string,
      {
        name: 'Jane Doe',
        password: 'newpassword123',
      },
      `Bearer ${token}`,
    );

    if (!updateResponse) {
      throw new Error('User not updated');
    }

    expect(updateResponse.user.name).toBe('Jane Doe');
    expect(updateResponse.user.password).not.toBe('newpassword123');
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

    await controller.delete(user.id, `Bearer ${token}`);
  });
});
