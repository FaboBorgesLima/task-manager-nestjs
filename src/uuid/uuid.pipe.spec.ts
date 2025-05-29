import { ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { UuidPipe } from './uuid.pipe';

describe('UuidPipe', () => {
  it('should be defined', () => {
    expect(new UuidPipe()).toBeDefined();
  });

  it('should transform valid UUID', () => {
    const pipe = new UuidPipe();
    const validUuid = '123e4567-e89b-12d3-a456-426614174000';
    const argumentMetadata: ArgumentMetadata = {
      type: 'param',
      data: 'id',
    };
    expect(pipe.transform(validUuid, argumentMetadata)).toBe(validUuid);
  });

  it('should throw BadRequestException for invalid UUID format', () => {
    const pipe = new UuidPipe();
    const invalidUuid = 'invalid-uuid-format';
    const argumentMetadata: ArgumentMetadata = {
      type: 'param',
      data: 'id',
    };
    expect(() => pipe.transform(invalidUuid, argumentMetadata)).toThrow(
      BadRequestException,
    );
  });
});
