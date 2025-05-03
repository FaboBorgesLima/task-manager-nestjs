import { TaskStatus } from '../task-status.enum';

export interface TaskUpdateInterface {
  title?: string;
  description?: string;
  status?: TaskStatus;
  dueDate?: Date;
}
