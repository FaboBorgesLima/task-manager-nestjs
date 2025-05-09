import { Task } from '../domain/task';
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
    taskEntity.dueDate = this.task.dueDate;
    taskEntity.status = this.task.status;
    taskEntity.userId = this.task.userId;

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
      dueDate: this.task.dueDate,
      status: this.task.status,
      userId: this.task.userId,
      createdAt: this.task.createdAt,
      updatedAt: this.task.updatedAt,
    };
  }

  public static fromResponseDto(json: TaskResponseDto): TaskAdapter {
    return new TaskAdapter(
      new Task({
        id: json.id,
        title: json.title,
        description: json.description,
        dueDate: json.dueDate,
        status: json.status,
        userId: json.userId,
        createdAt: json.createdAt,
        updatedAt: json.updatedAt,
      }),
    );
  }

  public static fromEntity(taskEntity: TaskEntity): TaskAdapter {
    return new TaskAdapter(
      new Task({
        id: taskEntity.id,
        title: taskEntity.title,
        description: taskEntity.description,
        dueDate: taskEntity.dueDate,
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
