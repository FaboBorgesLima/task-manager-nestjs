import { Controller, Get, ImATeapotException, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiIAmATeapotResponse } from '@nestjs/swagger';
import { FastifyRequest } from 'fastify';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/')
  getRoot(@Req() req: FastifyRequest['raw']) {
    return {
      message: 'Welcome to the Task Manager API',
      version: '1.0.0',
      documentation: `http://${req.headers.host}/swagger`,
    };
  }

  @Get('/test')
  getHello(): string {
    return this.appService.getHello();
  }

  @ApiIAmATeapotResponse()
  @Get('/teapot')
  getTeaPot(): void {
    throw new ImATeapotException();
  }
}
