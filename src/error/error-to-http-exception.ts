import { HttpException } from '@nestjs/common';

export function errorToHttpException<T>(
  func: () => T,
  status: number,
  message: string = '',
): T {
  try {
    return func();
  } catch (error) {
    if (error instanceof Error) {
      throw new HttpException(message || error.message, status);
    }
    throw new HttpException(message || 'An unexpected error occurred', status);
  }
}

export async function errorToHttpExceptionAsync<T>(
  func: () => Promise<T>,
  status: number,
  message: string = '',
): Promise<T> {
  try {
    return await func();
  } catch (error) {
    if (error instanceof Error) {
      throw new HttpException(message || error.message, status);
    }
    throw new HttpException(message || 'An unexpected error occurred', status);
  }
}
