import { TaskStatus } from '../task-status.enum';

export interface TaskConstructorInterface {
  id?: string;
  title: string;
  userId: string;
  description?: string;
  status: TaskStatus;
  createdAt: Date;
  updatedAt: Date;
  dueDate: Date;
}
