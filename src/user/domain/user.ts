import { HashMaker } from '../../hash-maker/hash-maker';
import { TokenGenerator } from '../../token-generator/token-generator';

export class User {
  public id?: string;

  public name: string;

  protected email: string;

  protected password: string;

  public token: string;

  constructor(name: string, email: string, password: string, token: string) {
    this.name = name;
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

    if (!HashMaker.isHash(hashPassword)) {
      hashPassword = HashMaker.make(password);
    }

    return new User(name, email, hashPassword, TokenGenerator.generate());
  }

  public static isEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  public getPassword(): string {
    return this.password;
  }
  public getEmail(): string {
    return this.email;
  }
}
