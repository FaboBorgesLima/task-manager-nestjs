import { ValidationCodeMakeProps } from './types/email-validation-make-props';
import { ValidationCodeProps } from './types/validation-code-props';

export class ValidationCode {
  protected _id?: string = undefined;
  protected _validationCode: string;
  protected _email: string;
  protected _createdAt: Date;

  get validationCode(): string {
    return this._validationCode;
  }
  get email(): string {
    return this._email;
  }
  get createdAt(): Date {
    return this._createdAt;
  }
  constructor({ email, validationCode, createdAt, id }: ValidationCodeProps) {
    this._email = email;
    this._validationCode = validationCode;
    this._createdAt = createdAt;
    this._id = id;
  }

  public static makeCode(): string {
    let code = '';

    for (let i = 0; i < 6; i++) {
      code += Math.floor(Math.random() * 10).toString();
    }

    return code;
  }

  public static make(props: ValidationCodeMakeProps): ValidationCode {
    const { email } = props;
    const validationCode = this.makeCode();
    const createdAt = new Date();

    return new ValidationCode({ email, validationCode, createdAt });
  }

  public stillValid(): boolean {
    const now = new Date();
    const diff = now.getTime() - this.createdAt.getTime();
    const minutes = Math.floor(diff / 1000 / 60);

    return minutes <= 5;
  }
}
