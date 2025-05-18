import { Task } from 'task-manager-domain/task';
import { TaskResponseDto } from '../app/dto/task-response-dto';
import { TaskEntity } from './task.entity';

export class TaskAdapter {
  private readonly task: Task;
  protected constructor(task: Task) {
    this.task = task;
  }

  public toEntity(): TaskEntity {
    const taskEntity = new TaskEntity();
    taskEntity.id = this.task.id;
    taskEntity.title = this.task.title;
    taskEntity.description = this.task.description;
    taskEntity.start = this.task.start;
    taskEntity.end = this.task.end;
    taskEntity.status = this.task.status;
    taskEntity.userId = this.task.userId;
    taskEntity.createdAt = this.task.createdAt;
    taskEntity.updatedAt = this.task.updatedAt;

    return taskEntity;
  }

  public toDomain(): Task {
    return this.task;
  }

  public toResponseDto(): TaskResponseDto {
    if (!this.task.id) {
      throw new Error('Task ID is not defined');
    }

    return {
      id: this.task.id,
      title: this.task.title,
      description: this.task.description,
      start: this.task.start,
      end: this.task.end,
      status: this.task.status,
      userId: this.task.userId,
      createdAt: this.task.createdAt,
      updatedAt: this.task.updatedAt,
    };
  }

  public static fromEntity(taskEntity: TaskEntity): TaskAdapter {
    return new TaskAdapter(
      new Task({
        id: taskEntity.id,
        title: taskEntity.title,
        description: taskEntity.description,
        start: taskEntity.start,
        end: taskEntity.end,
        status: taskEntity.status,
        userId: taskEntity.userId,
        createdAt: taskEntity.createdAt,
        updatedAt: taskEntity.updatedAt,
      }),
    );
  }

  public static fromDomain(task: Task): TaskAdapter {
    return new TaskAdapter(task);
  }
}
