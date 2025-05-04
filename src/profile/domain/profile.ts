export class Profile {
  id: string;
  name: string;
  protected _createdAt: Date;
  updatedAt: Date;

  constructor(id: string, name: string, createdAt: Date, updatedAt: Date) {
    this.id = id;
    this.name = name;
    this._createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  belongsTo(userId: string): boolean {
    return this.id === userId;
  }
}
