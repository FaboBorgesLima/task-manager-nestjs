import { User } from '../../user/domain/user';
import { TaskConstructorProps } from './types/task-constructor-props';
import { TaskCreateProps } from './types/task-create-props';
import { TaskUpdateProps } from './types/task-update-props';
import { TaskStatus } from './task-status.enum';

export class Task {
  protected _id?: string;
  protected _title: string;
  protected _description?: string;
  protected _dueDate: Date;
  protected _status: TaskStatus;
  public readonly createdAt: Date;
  protected _updatedAt: Date;
  protected _userId: string;

  constructor(params: TaskConstructorProps) {
    this._id = params.id;

    if (!Task.isTitleValid(params.title)) {
      throw new Error('Title must be at least 3 characters long');
    }

    this._title = params.title;
    this._description = params.description;
    this._status = params.status;
    this._userId = params.userId;

    this.createdAt = params.createdAt;
    this._updatedAt = params.updatedAt;
    this._dueDate = params.dueDate;
  }

  get title(): string {
    return this._title;
  }

  set title(value: string) {
    if (!Task.isTitleValid(value)) {
      throw new Error('Title must be at least 3 characters long');
    }
    this._title = value;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  get dueDate(): Date {
    return this._dueDate;
  }

  set dueDate(value: Date) {
    if (value < new Date()) {
      throw new Error('Due date cannot be in the past');
    }
    this._dueDate = value;
  }

  get status(): TaskStatus {
    return this._status;
  }

  set status(value: TaskStatus) {
    if (!Task.isTaskStatus(value)) {
      throw new Error('Invalid task status');
    }

    this._status = value;
  }

  get description(): string | undefined {
    return this._description;
  }

  set description(value: string | undefined) {
    if (!Task.isDescriptionValid(value)) {
      throw new Error('Description must be at least 3 characters long');
    }

    this._description = value;
  }

  get userId(): string {
    return this._userId;
  }

  get id(): string | undefined {
    return this._id;
  }

  public static create({
    title,
    description,
    userId,
    status = TaskStatus.PENDING,
    dueDate,
  }: TaskCreateProps): Task {
    if (!this.isTitleValid(title)) {
      throw new Error('Title must be at least 3 characters long');
    }

    return new Task({
      title,
      description,
      userId: userId,
      status,
      createdAt: new Date(),
      updatedAt: new Date(),
      dueDate,
    });
  }

  public static isTitleValid(title: string): boolean {
    return title.length >= 3;
  }

  public static isDescriptionValid(description?: string): boolean {
    return description !== undefined ? description.length >= 3 : true;
  }

  public static isTaskStatus(status: string): status is TaskStatus {
    return Object.values(TaskStatus).includes(status as TaskStatus);
  }

  public canBeViewed(user: User): boolean {
    return this._userId === user.id;
  }

  public canBeUpdated(user: User): boolean {
    return this._userId === user.id;
  }

  public canBeDeleted(user: User): boolean {
    return this._userId === user.id;
  }

  public update({
    title,
    description,
    status,
    dueDate,
  }: TaskUpdateProps): void {
    if (title) {
      if (!Task.isTitleValid(title)) {
        throw new Error('Title must be at least 3 characters long');
      }
      this._title = title;
    }

    if (description) {
      this._description = description;
    }

    if (status && Task.isTaskStatus(status)) {
      this._status = status;
    }

    if (dueDate) {
      this._dueDate = dueDate;
    }

    this._updatedAt = new Date();
  }
}
