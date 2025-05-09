import { DateRange } from 'src/types/domain/date-range';
import { Task } from './task';
import { TaskCreateProps } from './types/task-create-props';
import { TaskUpdateProps } from './types/task-update-props';

export interface TaskHttpAdapter {
  findOne(id: string, authorization: string): Promise<Task | null>;
  findFromUser(
    userId: string,
    authorization: string,
    range: DateRange,
  ): Promise<Task[]>;
  findFromCurrentUser(authorization: string, range: DateRange): Promise<Task[]>;
  create(
    taskCreateProps: TaskCreateProps,
    authorization: string,
  ): Promise<Task>;
  update(
    taskId: string,
    taskUpdateProps: TaskUpdateProps,
    authorization: string,
  ): Promise<Task>;

  delete(id: string, authorization: string): Promise<void>;
}
