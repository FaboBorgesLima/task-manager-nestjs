import { HashMaker } from '../../hash-maker/hash-maker';
import { UserCreateProps } from './types/user-create-props';
import { UserProps } from './types/user-props';

export class User {
  public id?: string;

  protected _name: string;

  protected _email: string;

  protected _password: string;

  protected createdAt: Date;
  public updatedAt: Date;

  constructor({
    id,
    name,
    email,
    password,
    createdAt = new Date(),
    updatedAt = new Date(),
  }: UserProps) {
    this.id = id;
    if (!name || name.length < 3) {
      throw new Error('Name must be at least 3 characters long');
    }

    this._name = name;

    if (!User.isEmail(email)) {
      throw new Error('Invalid email format');
    }
    this._email = email;

    if (!HashMaker.isHash(password)) {
      throw new Error('Password must be a hash');
    }

    this._password = password;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public static create({ name, email, password }: UserCreateProps): User {
    if (!this.isEmail(email)) {
      throw new Error('Invalid email format');
    }

    let hashPassword = password;

    if (!password) {
      throw new Error('Password is required');
    }

    if (password.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }

    if (!HashMaker.isHash(hashPassword)) {
      hashPassword = HashMaker.make(password);
    }

    return new User({
      name,
      email,
      password: hashPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
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

  public changePassword(password: string, user: User): void {
    if (!this.canUpdate(user)) {
      throw new Error('User not authorized to update password');
    }
    let hashPassword = password;

    if (!HashMaker.isHash(password)) {
      hashPassword = HashMaker.make(password);
    }

    this._password = hashPassword;
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
