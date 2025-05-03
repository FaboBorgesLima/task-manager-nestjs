import {
  ArgumentMetadata,
  HttpException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class BigIntPipe implements PipeTransform {
  transform(value: unknown, metadata: ArgumentMetadata): bigint {
    try {
      return BigInt(String(value));
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      throw new HttpException(
        `Invalid value for BigInt in ${metadata.type}.${metadata.data ? metadata.data : 'unknown'}: ${String(value)}`,
        400,
      );
    }
  }
}
