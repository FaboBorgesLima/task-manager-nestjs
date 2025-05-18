import { Test, TestingModule } from '@nestjs/testing';
import { TaskController } from './task.controller';
import { UserRepositoryInterface } from '../../user/domain/user.repository.interface';
import { UserMemoryService } from '../../user/infra/services/user-memory.service';
import { User } from '../../user/domain/user';
import { faker } from '@faker-js/faker/.';
import { TaskStatus } from '../domain/task-status.enum';
import { TaskRepositoryInterface } from '../domain/task.repository.interface';
import { AbstractAuthService } from '../../auth/domain/abstract-auth.service';
import { AuthIdService } from '../../auth/infra/services/auth-id.service';
import { TaskMemoryRepository } from '../infra/services/task-memory.repository';
import { HashMockService } from '../../hash/app/hash-mock.service';

describe('TaskController', () => {
  let controller: TaskController;
  const userService: UserRepositoryInterface = new UserMemoryService();
  const taskService: TaskRepositoryInterface = new TaskMemoryRepository();
  const authService: AbstractAuthService = new AuthIdService(userService);
  let user: User;
  let token: string;

  beforeAll(async () => {
    user = User.create(
      {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      },
      HashMockService.getInstance(),
    );
    await userService.saveOne(user);
    token = await authService.toToken(user);
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      imports: [],
      providers: [
        {
          provide: UserRepositoryInterface,
          useValue: userService,
        },
        {
          provide: TaskRepositoryInterface,
          useValue: taskService,
        },
        {
          provide: AbstractAuthService,
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

    const deletedTask = await taskService.findById(task.id || '');
    expect(deletedTask).toBeUndefined();
  });
});
