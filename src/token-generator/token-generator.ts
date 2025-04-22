import { Injectable } from '@nestjs/common';
import { randomBytes, randomUUID } from 'crypto';

@Injectable()
export class TokenGenerator {
  public generate(): string {
    return TokenGenerator.generate();
  }

  public static generate(): string {
    return randomUUID();
  }
}
