import { TaskStatus } from '../domain/task-status.enum';

export interface TaskJSON {
  id: string;
  title: string;
  description?: string;
  dueDate: Date;
  status: TaskStatus;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}
