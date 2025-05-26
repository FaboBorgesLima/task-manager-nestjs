import { HttpStatus, Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { IncomingMessage, ServerResponse } from 'http';
import { AuthService } from '../auth.service';
import { User } from '@faboborgeslima/task-manager-domain/user';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  public constructor(
    @Inject(AuthService)
    private readonly authService: AuthService,
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
    let user: User;

    try {
      const auth = await this.authService.fromToken(authToken);
      user = auth.user;
    } catch {
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
