import {
  ArgumentMetadata,
  HttpException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class BigIntPipe implements PipeTransform {
  transform(value: unknown, metadata: ArgumentMetadata): string {
    try {
      BigInt(String(value));
      return String(value);
    } catch {
      throw new HttpException(
        `Invalid value for BigInt in ${metadata.type}.${metadata.data ? metadata.data : 'unknown'}: ${String(value)}`,
        400,
      );
    }
  }
}
