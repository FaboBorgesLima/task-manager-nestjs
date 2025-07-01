import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import {
  TaskRepositoryInterface,
  Task,
} from '@faboborgeslima/task-manager-domain/task';

@Injectable()
export class TaskMemoryRepository implements TaskRepositoryInterface {
  private static tasks: Task[] = [];

  constructor() {}

  findById(id: string): Promise<Task | void> {
    const task = TaskMemoryRepository.tasks.find((task) => task.id === id);
    return Promise.resolve(task);
  }

  delete(id: string): Promise<void> {
    TaskMemoryRepository.tasks = TaskMemoryRepository.tasks.filter(
      (task) => task.id !== id,
    );
    return Promise.resolve();
  }

  findByUser(userId: string, size: number, page: number): Promise<Task[]> {
    const tasks = TaskMemoryRepository.tasks.filter(
      (task) => task.userId === userId,
    );
    const startIndex = page * size;
    const endIndex = startIndex + size;
    if (startIndex >= tasks.length) {
      return Promise.resolve([]);
    }
    if (endIndex > tasks.length) {
      return Promise.resolve(tasks.slice(startIndex));
    }
    tasks.splice(0, startIndex);
    tasks.splice(size);

    return Promise.resolve(tasks);
  }

  findByUserAndDate(
    userId: string,
    startDate: Date,
    endDate: Date,
    size: number,
    page: number,
  ): Promise<Task[]> {
    const tasks = TaskMemoryRepository.tasks.filter(
      (task) =>
        task.userId === userId &&
        task.start >= startDate &&
        task.end <= endDate,
    );
    const startIndex = page * size;
    const endIndex = startIndex + size;
    if (startIndex >= tasks.length) {
      return Promise.resolve([]);
    }
    if (endIndex > tasks.length) {
      return Promise.resolve(tasks.slice(startIndex));
    }
    tasks.splice(0, startIndex);
    tasks.splice(size);
    return Promise.resolve(tasks);
  }

  async save(task: Task): Promise<Task> {
    if (task.id) {
      const index = TaskMemoryRepository.tasks.findIndex(
        (t) => t.id === task.id,
      );
      if (index !== -1) {
        TaskMemoryRepository.tasks[index] = task;
      }
    } else {
      task.id = randomUUID();

      TaskMemoryRepository.tasks.push(task);
    }

    return Promise.resolve(task);
  }
}
