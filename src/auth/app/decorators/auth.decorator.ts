import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { FastifyRequest } from 'fastify';

export const Auth = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<FastifyRequest>();
    if (!request.raw['user']) {
      console.error('User not found in request');
      throw new Error('User not found in request');
    }
    // @ts-ignore
    return request.raw.user;
  },
);
