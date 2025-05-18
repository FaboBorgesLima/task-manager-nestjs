import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Task } from '../../domain/task';
import { TaskRepositoryInterface } from '../../domain/task.repository.interface';
import { TaskAdapter } from '../task-adapter';
import { TaskResponseDto } from '../../app/dto/task-response-dto';

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

  findByUser(userId: string): Promise<Task[]> {
    const tasks = TaskMemoryRepository.tasks.filter(
      (task) => task.userId === userId,
    );
    return Promise.resolve(tasks);
  }

  findByUserAndDate(
    userId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<Task[]> {
    const tasks = TaskMemoryRepository.tasks.filter(
      (task) =>
        task.userId === userId &&
        task.start >= startDate &&
        task.end <= endDate,
    );
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
