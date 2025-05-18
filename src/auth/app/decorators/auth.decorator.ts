import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { User } from '../../../user/domain/user';

export const Auth = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<FastifyRequest>();
    if (!request.raw['user']) {
      console.error('User not found in request');
      throw new Error('User not found in request');
    }
    // @ts-expect-error because user is not defined in FastifyRequest
    return (request.raw as { user: User }).user;
  },
);
