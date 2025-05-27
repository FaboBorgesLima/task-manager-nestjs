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
import { AuthService } from './services/auth.service';
import { EmailValidationService } from '../../email-validation/app/email-validation.service';
import { ValidationCodeMemoryRepository } from '../../email-validation/infra/repositories/validation-code-memory.repository';
import { EmailMockService } from '../../email/app/email-mock.service';

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
          useValue: new EmailValidationService(
            new ValidationCodeMemoryRepository(),
            new EmailMockService(),
          ),
        },
      ],
      imports: [],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should send validation email', async () => {
    const email = faker.internet.email();
    await controller.sendValidation({ email });
    const validationCode = ValidationCodeMemoryRepository.store.get(email);
    expect(validationCode).toBeDefined();
  });

  it('should register a user', async () => {
    const email = faker.internet.email();
    await controller.sendValidation({ email });
    const code = ValidationCodeMemoryRepository.store.get(email)
      ?.validationCode as string;

    const result = await controller.register({
      name: faker.person.fullName(),
      email,
      password: 'password123',
      validation: code,
    });

    expect(result.token).toBeDefined();
    expect(result.user).toBeDefined();
  });

  it('should throw an error if email is not valid', async () => {
    await expect(
      controller.register({
        name: faker.person.fullName(),
        email: 'invalid-email',
        password: 'password123',
        validation: 'invalid-validation',
      }),
    ).rejects.toThrow(Error);
  });

  it('should throw an error if validation code is invalid', async () => {
    const email = faker.internet.email();
    await controller.sendValidation({ email });
    const invalidCode = 'invalid-code';
    await expect(
      controller.register({
        name: faker.person.fullName(),
        email,
        password: 'password123',
        validation: invalidCode,
      }),
    ).rejects.toThrow(Error);
  });

  it('should login a user', async () => {
    const email = faker.internet.email();
    await controller.sendValidation({ email });
    const code = ValidationCodeMemoryRepository.store.get(email)
      ?.validationCode as string;

    const { user } = await controller.register({
      name: faker.person.fullName(),
      email,
      password: 'password123',
      validation: code,
    });

    const result = await controller.login({
      email: user.email,
      password: 'password123',
    });

    expect(result.token).toBeDefined();
    expect(result.user).toBeDefined();
  });
});
