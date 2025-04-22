import { Injectable } from '@nestjs/common';
import { isHash } from 'class-validator';
import { createHmac } from 'crypto';

@Injectable()
export class HashMaker {
  public make(password: string): string {
    return HashMaker.make(password);
  }

  public static make(password: string): string {
    const hmac = createHmac('sha256', process.env.HASH_KEY ?? '');

    hmac.update(password);
    return hmac.digest('base64url');
  }
  public isHash(hash: string): boolean {
    return HashMaker.isHash(hash);
  }

  public static isHash(hash: string): boolean {
    return hash.length === 43;
  }
}
