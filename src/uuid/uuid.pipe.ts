import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class UuidPipe implements PipeTransform {
  transform(value: unknown, metadata: ArgumentMetadata) {
    if (typeof value !== 'string') {
      throw new BadRequestException(
        `Invalid value for UUID in ${metadata.type}.${metadata.data ? metadata.data : 'unknown'}: ${String(value)}`,
      );
    }

    // Validate UUID format
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(value)) {
      throw new BadRequestException(
        `Invalid UUID format in ${metadata.type}.${metadata.data ? metadata.data : 'unknown'}: ${String(value)}`,
      );
    }

    return value;
  }
}
