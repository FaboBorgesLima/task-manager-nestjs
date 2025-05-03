import { Task } from './task';

export interface TaskServiceInterface {
  save(task: Task): Promise<Task>;
  findById(id: string): Promise<Task | void>;
  findByUser(userId: string): Promise<Task[]>;
  findByUserAndDate(
    userId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<Task[]>;
  delete(id: string): Promise<void>;
}

export const TaskServiceInterface = Symbol('TaskServiceInterface');
