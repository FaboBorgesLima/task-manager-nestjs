import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { UserRepositoryInterface } from '@faboborgeslima/task-manager-domain/user';
import { UserMemoryService } from '../../user/infra/services/user-memory.service';
import { User } from '@faboborgeslima/task-manager-domain/user';
import { AbstractAuthService } from '@faboborgeslima/task-manager-domain/auth';
import { AuthJwtService } from '../infra/services/auth-jwt.service';
import { JwtModule } from '@nestjs/jwt';
import {
  HashMockService,
  HashServiceInterface,
} from '@faboborgeslima/task-manager-domain/hash';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: UserRepositoryInterface,
          useClass: UserMemoryService,
        },
        {
          provide: AbstractAuthService,
          useClass: AuthJwtService,
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

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should login a user', async () => {
    const userRepository = new UserMemoryService();

    await expect(
      controller.login({
        email: 'test@example.com',
        password: 'password123',
      }),
    ).rejects.toThrow();

    const user = User.create(
      {
        name: 'John Doe',
        email: 'test@example.com',
        password: 'password123',
      },
      HashMockService.getInstance(),
    );

    await userRepository.saveOne(user);

    const loggedInUser = await controller.login({
      email: 'test@example.com',
      password: 'password123',
    });

    expect(loggedInUser).toBeDefined();
  });

  it('should return user from token', async () => {
    const userRepository = new UserMemoryService();
    const user = User.create(
      {
        name: 'John Doe',
        email: 'test@testeee.com',
        password: 'password123',
      },
      HashMockService.getInstance(),
    );
    await userRepository.saveOne(user);

    const { token } = await controller.login({
      email: 'test@testeee.com',
      password: 'password123',
    });

    expect(token).toBeDefined();
    const userFromToken = await controller.me(`Bearer ${token}`);

    expect(userFromToken).toBeDefined();
    expect(userFromToken.email).toBe('test@testeee.com');
  });
});
