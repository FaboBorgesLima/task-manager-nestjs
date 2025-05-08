import { UserCreateProps } from './types/user-create-props';
import { UserProps } from './types/user-props';
import { HashServiceInterface } from '../../hash/domain/hash.service.interface';

export class User {
  public id?: string;

  protected _name: string;

  protected _email: string;

  protected _password: string;

  protected _createdAt: Date;
  public updatedAt: Date;

  constructor({
    id,
    name,
    email,
    password,
    createdAt = new Date(),
    updatedAt = new Date(),
  }: UserProps) {
    this._name = name;
    this.id = id;
    this._email = email;

    this._password = password;
    this._createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  public getCreatedAt(): Date {
    return this._createdAt;
  }

  public static create(
    { name, email, password }: UserCreateProps,
    hashService: HashServiceInterface,
  ): User {
    if (!this.isEmail(email)) {
      throw new Error('Invalid email format');
    }
    if (!User.isValidPassword(password)) {
      throw new Error('Invalid password format');
    }
    if (!name || name.length < 3) {
      throw new Error('Name must be at least 3 characters long');
    }

    return new User({
      name,
      email,
      password: hashService.make(password),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  public static isValidPassword(password: string): boolean {
    return password.length >= 6;
  }

  public static isEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  public canUpdate(user: User): boolean {
    return this.id === user.id;
  }

  public canDelete(user: User): boolean {
    return this.id === user.id;
  }

  public canSee(user: User): boolean {
    return this.id === user.id;
  }

  public getPassword(): string {
    return this._password;
  }
  get password(): string {
    return this._password;
  }

  public setName(name: string, user: User): void {
    if (!this.canUpdate(user)) {
      throw new Error('User not authorized to update name');
    }
    this._name = name;
  }

  get name(): string {
    return this._name;
  }

  public getName(): string {
    return this._name;
  }
  get email(): string {
    return this._email;
  }

  public getEmail(): string {
    return this._email;
  }

  public canViewTasks(user: User): boolean {
    return this.id === user.id;
  }
}
