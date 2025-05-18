import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { DomainError } from '@faboborgeslima/task-manager-domain/error';
import { catchError, Observable } from 'rxjs';

@Injectable()
export class DomainErrorInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      catchError((error) => {
        if (error instanceof DomainError) {
          throw new HttpException(error.message, 400);
        }

        throw error;
      }),
    );
  }
}
