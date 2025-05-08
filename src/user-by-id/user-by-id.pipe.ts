import {
  ArgumentMetadata,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { UserServiceInterface } from '../user/domain/user.service.interface';

@Injectable()
export class UserByIdPipe implements PipeTransform {
  constructor(
    @Inject(UserServiceInterface)
    private readonly userService: UserServiceInterface,
  ) {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async transform(value: unknown, metadata: ArgumentMetadata) {
    if (!value || typeof value !== 'string' || !value.trim()) {
      throw new HttpException(
        'User ID is required and must be a non-empty string',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (typeof value != 'string') {
      throw new HttpException(
        'User ID must be a string',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const user = await this.userService.findOne(value);
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      return user;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new HttpException('Invalid user ID', HttpStatus.BAD_REQUEST);
    }
  }
}
