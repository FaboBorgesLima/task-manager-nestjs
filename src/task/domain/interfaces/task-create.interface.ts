import { TaskStatus } from '../task-status.enum';

export interface TaskCreateInterface {
  title: string;
  description: string;
  userId: string;
  dueDate: Date;
  status?: TaskStatus;
}
