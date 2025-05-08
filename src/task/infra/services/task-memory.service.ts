import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Task } from '../../domain/task';
import { TaskServiceInterface } from '../../domain/task.service.interface';
import { TaskAdapter } from '../task-adapter';
import { TaskResponseDto } from '../../app/dto/task-response-dto';

@Injectable()
export class TaskMemoryService implements TaskServiceInterface {
  private static tasks: Task[] = [];

  constructor() {}

  findById(id: string): Promise<Task | void> {
    const task = TaskMemoryService.tasks.find((task) => task.id === id);
    return Promise.resolve(task);
  }

  delete(id: string): Promise<void> {
    TaskMemoryService.tasks = TaskMemoryService.tasks.filter(
      (task) => task.id !== id,
    );
    return Promise.resolve();
  }

  findByUser(userId: string): Promise<Task[]> {
    const tasks = TaskMemoryService.tasks.filter(
      (task) => task.userId === userId,
    );
    return Promise.resolve(tasks);
  }

  findByUserAndDate(
    userId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<Task[]> {
    const tasks = TaskMemoryService.tasks.filter(
      (task) =>
        task.userId === userId &&
        task.dueDate >= startDate &&
        task.dueDate <= endDate,
    );
    return Promise.resolve(tasks);
  }

  async save(task: Task): Promise<Task> {
    const taskJSON: TaskResponseDto = {
      id: task.id || randomUUID(),
      createdAt: task.createdAt || new Date(),
      updatedAt: task.updatedAt || new Date(),
      status: task.status,
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
      userId: task.userId,
    };

    if (task.id) {
      const index = TaskMemoryService.tasks.findIndex((t) => t.id === task.id);
      if (index !== -1) {
        TaskMemoryService.tasks[index] = task;
      }
    } else {
      TaskMemoryService.tasks.push(
        TaskAdapter.fromResponseDto(taskJSON).toDomain(),
      );
    }

    return Promise.resolve(TaskAdapter.fromResponseDto(taskJSON).toDomain());
  }
}
