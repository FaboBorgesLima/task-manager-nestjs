import { TaskStatus } from '../task-status.enum';

export type TaskConstructorProps = {
  id?: string;
  title: string;
  userId: string;
  description?: string;
  status: TaskStatus;
  createdAt: Date;
  updatedAt: Date;
  start: Date;
  end: Date;
};
