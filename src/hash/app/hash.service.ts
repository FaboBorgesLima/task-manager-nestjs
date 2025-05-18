import { Injectable } from '@nestjs/common';
import { createHmac } from 'crypto';
import { HashServiceInterface } from 'task-manager-domain/hash';

@Injectable()
export class HashService implements HashServiceInterface {
  public make(str: string): string {
    const hmac = createHmac('sha256', process.env.HASH_KEY ?? '');

    hmac.update(str);
    return hmac.digest('base64url');
  }
}
