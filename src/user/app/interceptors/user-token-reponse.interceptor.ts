import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { User } from '../../domain/user';
import { UserResponseDto } from '../dtos/user-response-dto';
import { UserAdapter } from '../../../user/infra/user-adapter';
import { ApiProperty } from '@nestjs/swagger';

@Injectable()
export class UserTokenResponseInterceptor
  implements
    NestInterceptor<
      { token: string; user: User },
      { token: string; user: UserResponseDto }
    >
{
  intercept(
    context: ExecutionContext,
    next: CallHandler<{ token: string; user: User }>,
  ): Observable<{ token: string; user: UserResponseDto }> {
    return next.handle().pipe(
      map(({ token, user }) => ({
        token,
        user: UserAdapter.fromDomain(user).toResponseDTO(),
      })),
    );
  }
}
export class ApiBodyUserTokenResponseInterceptor extends UserTokenResponseInterceptor {
  @ApiProperty()
  token: string;
  @ApiProperty()
  user: UserResponseDto;
}
