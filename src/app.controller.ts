import { Controller, Get, ImATeapotException } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/test')
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/teapot')
  getTeaPot(): void {
    throw new ImATeapotException();
  }
}
