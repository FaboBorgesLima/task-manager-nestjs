import { TaskStatus } from '../task-status.enum';

export type TaskCreateProps = {
  title: string;
  description: string;
  userId: string;
  start: Date;
  end: Date;
  status?: TaskStatus;
};
