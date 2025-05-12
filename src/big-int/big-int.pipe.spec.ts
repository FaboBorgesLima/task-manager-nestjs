import { ArgumentMetadata, HttpException } from '@nestjs/common';
import { BigIntPipe } from './big-int.pipe';

describe('BigIntPipe', () => {
  it('should be defined', () => {
    expect(new BigIntPipe()).toBeDefined();
  });

  it('should transform value to BigInt', () => {
    const pipe = new BigIntPipe();
    const metadata = {
      type: 'body',
      metatype: null,
      data: null,
    } as unknown as ArgumentMetadata;

    expect(pipe.transform('12345678901234567890', metadata)).toEqual(
      '12345678901234567890',
    );

    expect(() => {
      pipe.transform('invalid', metadata);
    }).toThrow(HttpException);
  });
});
