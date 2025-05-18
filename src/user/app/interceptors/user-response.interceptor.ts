import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { User } from '@faboborgeslima/task-manager-domain/user';
import { UserResponseDto } from '../dtos/user-response-dto';
import { UserAdapter } from '../../../user/infra/user-adapter';

@Injectable()
export class UserResponseInterceptor
  implements NestInterceptor<User, UserResponseDto>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler<User>,
  ): Observable<UserResponseDto> {
    return next
      .handle()
      .pipe(map((user) => UserAdapter.fromDomain(user).toResponseDTO()));
  }
}

export class ApiBodyUserResponseInterceptor extends UserResponseDto {}
