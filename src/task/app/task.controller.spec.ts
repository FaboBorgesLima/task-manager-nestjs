import { Test, TestingModule } from '@nestjs/testing';
import { TaskController } from './task.controller';
import { UserMemoryRepository } from '../../user/infra/repositories/user-memory.repository';
import {
  User,
  UserRepositoryInterface,
} from '@faboborgeslima/task-manager-domain/user';
import { faker } from '@faker-js/faker';
import {
  TaskStatus,
  TaskRepositoryInterface,
} from '@faboborgeslima/task-manager-domain/task';
import { AuthService } from '@faboborgeslima/task-manager-domain/auth';
import { AuthIdRepository } from '../../auth/infra/repositories/auth-id.repository';
import { TaskMemoryRepository } from '../infra/services/task-memory.repository';
import { ValidationCodeMemoryRepository } from '../../email-validation/infra/repositories/validation-code-memory.repository';
import { EmailValidationService } from '../../email-validation/app/email-validation.service';
import { EmailMockService } from '../../email/app/email-mock.service';

describe('TaskController', () => {
  let controller: TaskController;
  const userRepository: UserRepositoryInterface = new UserMemoryRepository();
  const taskRepository: TaskRepositoryInterface = new TaskMemoryRepository();
  const authService: AuthService = new AuthService(
    new AuthIdRepository(userRepository),
    new EmailValidationService(
      new ValidationCodeMemoryRepository(),
      new EmailMockService(),
    ),
  );
  let user: User;

  beforeAll(async () => {
    user = User.create({
      name: faker.person.fullName(),
      email: faker.internet.email(),
    });
    await userRepository.saveOne(user);
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      imports: [],
      providers: [
        {
          provide: UserRepositoryInterface,
          useValue: userRepository,
        },
        {
          provide: TaskRepositoryInterface,
          useValue: taskRepository,
        },
        {
          provide: AuthService,
          useValue: authService,
        },
      ],
    }).compile();

    controller = module.get<TaskController>(TaskController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create task', async () => {
    const task = await controller.create(
      {
        title: 'Test Task',
        description: 'This is a test task',
        userId: '',
        start: new Date(),
        end: new Date(),
      },
      user,
    );

    expect(task).toBeDefined();
    expect(task.title).toBe('Test Task');
    expect(task.description).toBe('This is a test task');
    expect(task.status).toBe(TaskStatus.PENDING);
    expect(task.userId).toBe(user.id);
  });

  it('should return tasks for a user', async () => {
    const tasks = await controller.findFromUser(user.id || '', user, {
      endDate: new Date(),
      startDate: new Date(),
    });

    expect(tasks).toBeDefined();
    expect(Array.isArray(tasks)).toBeTruthy();
  });

  it('should return a task', async () => {
    const task = await controller.create(
      {
        title: 'Test Task',
        description: 'This is a test task',
        userId: '',
        start: new Date(),
        end: new Date(),
        status: TaskStatus.PENDING,
      },
      user,
    );

    const taskGet = await controller.findOne(task.id || '', user);

    expect(taskGet).toBeDefined();
    expect(taskGet.id).toBe(task.id);
  });

  it('should update a task', async () => {
    const task = await controller.create(
      {
        title: 'Test Task',
        description: 'This is a test task',
        userId: '',
        start: new Date(),
        end: new Date(),

        status: TaskStatus.PENDING,
      },
      user,
    );

    const updatedTask = await controller.update(
      task.id || '',
      {
        title: 'Updated Task',
        description: 'This is an updated test task',
        start: new Date(),
        end: new Date(),
      },
      user,
    );

    expect(updatedTask).toBeDefined();
    expect(updatedTask.title).toBe('Updated Task');
    expect(updatedTask.description).toBe('This is an updated test task');
  });

  it('should delete a task', async () => {
    const task = await controller.create(
      {
        title: 'Test Task',
        description: 'This is a test task',
        userId: '',
        start: new Date(),
        end: new Date(),
      },
      user,
    );

    await controller.delete(task.id || '', user);

    const deletedTask = await taskRepository.findById(task.id || '');
    expect(deletedTask).toBeUndefined();
  });
});
