import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { UserRepositoryInterface } from '@faboborgeslima/task-manager-domain/user';
import { UserMemoryRepository } from '../../user/infra/repositories/user-memory.repository';
import {
  AuthRepositoryInterface,
  EmailValidationServiceInterface,
} from '@faboborgeslima/task-manager-domain/auth';
import { AuthIdRepository } from '../infra/repositories/auth-id.repository';
import { faker } from '@faker-js/faker';
import { AuthService } from './auth.service';
import { MockEmailValidationService } from '../infra/services/mock-email-validation.service';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        {
          provide: UserRepositoryInterface,
          useValue: new UserMemoryRepository(),
        },
        {
          provide: AuthRepositoryInterface,
          useValue: new AuthIdRepository(new UserMemoryRepository()),
        },
        {
          provide: EmailValidationServiceInterface,
          useClass: MockEmailValidationService,
        },
      ],
      imports: [],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should register a user', async () => {
    const result = await controller.register({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: 'password123',
      validation: MockEmailValidationService.VALIDATION_CODE,
    });

    expect(result.token).toBeDefined();
    expect(result.user).toBeDefined();
  });

  it('should throw an error if email is not valid', async () => {
    await expect(
      controller.register({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: 'password123',
        validation: 'invalid-validation',
      }),
    ).rejects.toThrow(Error);
  });

  it('should login a user', async () => {
    const { user } = await controller.register({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: 'password123',
      validation: MockEmailValidationService.VALIDATION_CODE,
    });

    const result = await controller.login({
      email: user.email,
      password: 'password123',
    });

    expect(result.token).toBeDefined();
    expect(result.user).toBeDefined();
  });
});
