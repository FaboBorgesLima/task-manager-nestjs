import { HttpStatus, Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { IncomingMessage, ServerResponse } from 'http';
import { AbstractAuthService } from 'task-manager-domain/auth';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  public constructor(
    @Inject(AbstractAuthService)
    private readonly authService: AbstractAuthService,
  ) {
    //
  }
  async use(req: IncomingMessage, res: ServerResponse, next: () => void) {
    const authToken = req.headers['authorization'];

    if (!authToken) {
      res.writeHead(HttpStatus.UNAUTHORIZED, {
        'Content-Type': 'application/json',
      });
      res.write(
        JSON.stringify({
          statusCode: HttpStatus.UNAUTHORIZED,
          message: 'Unauthorized',
        }),
      );
      res.end();
      return;
    }
    const user = await this.authService.getUserFromHeader(authToken);

    if (!user) {
      res.writeHead(HttpStatus.UNAUTHORIZED, {
        'Content-Type': 'application/json',
      });
      res.write(
        JSON.stringify({
          statusCode: HttpStatus.UNAUTHORIZED,
          message: 'Unauthorized',
        }),
      );
      res.end();
      return;
    }

    req['user'] = user;
    next();
  }
}
