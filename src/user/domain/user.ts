import { HashMaker } from '../../hash-maker/hash-maker';

export class User {
  public id?: string;

  protected name: string;

  protected email: string;

  protected password: string;

  protected createdAt: Date;
  public updatedAt: Date;

  constructor(
    name: string,
    email: string,
    password: string,
    createdAt: Date = new Date(),
    updatedAt: Date = new Date(),
  ) {
    if (!name || name.length < 3) {
      throw new Error('Name must be at least 3 characters long');
    }

    this.name = name;

    if (!User.isEmail(email)) {
      throw new Error('Invalid email format');
    }
    this.email = email;

    if (!HashMaker.isHash(password)) {
      throw new Error('Password must be a hash');
    }

    this.password = password;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public static create(name: string, email: string, password: string): User {
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

    return new User(name, email, hashPassword);
  }

  public static isEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  public canUpdate(user: User): boolean {
    return this.password === user.password && this.id === user.id;
  }

  public canDelete(user: User): boolean {
    return this.password === user.password && this.id === user.id;
  }

  public getPassword(): string {
    return this.password;
  }

  public changePassword(password: string, user: User): void {
    if (!this.canUpdate(user)) {
      throw new Error('User not authorized to update password');
    }
    let hashPassword = password;

    if (!HashMaker.isHash(password)) {
      hashPassword = HashMaker.make(password);
    }

    this.password = hashPassword;
  }

  public setName(name: string, user: User): void {
    if (!this.canUpdate(user)) {
      throw new Error('User not authorized to update name');
    }
    this.name = name;
  }

  public getName(): string {
    return this.name;
  }

  public getEmail(): string {
    return this.email;
  }

  public canViewTasks(user: User): boolean {
    return this.id === user.id;
  }

  public toJSON() {
    return {
      id: this.id,
      createdAt: this.getCreatedAt(),
      updatedAt: this.updatedAt,
      password: this.password,
      name: this.name,
      email: this.email,
    };
  }

  public toJSONProfile() {
    return {
      id: this.id,
      name: this.name,
    };
  }
}
