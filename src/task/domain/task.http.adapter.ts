import { DateRange } from 'src/types/domain/date-range';
import { Task } from './task';
import { TaskCreateProps } from './types/task-create-props';
import { TaskUpdateProps } from './types/task-update-props';
import { User } from '../../user/domain/user';

export interface TaskHttpAdapter {
  findOne(id: string, authorization: User): Promise<Task | null>;
  findFromUser(
    userId: string,
    authorization: User,
    range: DateRange,
  ): Promise<Task[]>;
  findFromCurrentUser(authorization: User, range: DateRange): Promise<Task[]>;
  create(taskCreateProps: TaskCreateProps, authorization: User): Promise<Task>;
  update(
    taskId: string,
    taskUpdateProps: TaskUpdateProps,
    authorization: User,
  ): Promise<Task>;

  delete(id: string, authorization: User): Promise<void>;
}
