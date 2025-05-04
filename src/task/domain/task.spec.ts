import { faker } from '@faker-js/faker/.';
import { User } from '../../user/domain/user';
import { Task } from './task';
import { TaskStatus } from './task-status.enum';

describe('Task', () => {
  it('should be defined', () => {
    expect(
      new Task({
        title: 'Test Task',
        description: 'This is a test task',
        userId: 'user-123',
        status: TaskStatus.PENDING,
        createdAt: new Date(),
        updatedAt: new Date(),
        dueDate: new Date(),
      }),
    ).toBeDefined();
  });

  it('should create a task with default status', () => {
    const user = User.create({
      name: 'Test User',
      email: faker.internet.email(),
      password: faker.internet.password(),
    });
    user.id = 'user-123';
    const task = Task.create({
      title: 'Test Task',
      description: 'This is a test task',
      userId: user.id || '',
      status: TaskStatus.PENDING,
      dueDate: new Date(),
    });
    expect(task).toBeDefined();
    expect(task.title).toBe('Test Task');
    expect(task.description).toBe('This is a test task');
    expect(task.status).toBe(TaskStatus.PENDING);
  });

  it('should throw an error if title is empty', () => {
    const user = User.create({
      name: 'Test User',
      email: faker.internet.email(),
      password: faker.internet.password(),
    });
    user.id = 'user-123';

    expect(() => {
      Task.create({
        title: '',
        description: 'This is a test task',
        userId: user.id || '',
        status: TaskStatus.PENDING,
        dueDate: new Date(),
      });
    }).toThrow();
  });
});
