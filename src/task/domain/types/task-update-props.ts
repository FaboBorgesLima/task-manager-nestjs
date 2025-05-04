import { TaskStatus } from '../task-status.enum';

export type TaskUpdateProps = {
  title?: string;
  description?: string;
  status?: TaskStatus;
  dueDate?: Date;
};
