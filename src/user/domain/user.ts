import { HashMaker } from '../../hash-maker/hash-maker';
import { TokenGenerator } from '../../token-generator/token-generator';

export class User {
  public id?: string;

  protected name: string;

  protected email: string;

  protected password: string;

  public token: string;

  constructor(name: string, email: string, password: string, token: string) {
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
    this.token = token;
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

    return new User(name, email, hashPassword, TokenGenerator.generate());
  }

  public static isEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  public canUpdate(user: User): boolean {
    return this.id === user.id;
  }

  public getPassword(): string {
    return this.password;
  }

  public setPassword(password: string, user: User): void {
    if (!this.canUpdate(user)) {
      throw new Error('User not authorized to update password');
    }

    if (!HashMaker.isHash(password)) {
      this.password = HashMaker.make(password);
      return;
    }
    this.password = password;
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

  public toJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      token: this.token,
    };
  }

  public toJSONProfile() {
    return {
      id: this.id,
      name: this.name,
    };
  }
}
