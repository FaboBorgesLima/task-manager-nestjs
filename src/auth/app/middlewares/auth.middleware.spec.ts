import { AuthIdService } from '../../../auth/infra/services/auth-id.service';
import { AuthMiddleware } from './auth.middleware';
import { UserMemoryService } from '../../../user/infra/services/user-memory.service';

describe('AuthMiddleware', () => {
  it('should be defined', () => {
    expect(
      new AuthMiddleware(new AuthIdService(new UserMemoryService())),
    ).toBeDefined();
  });
  it('should return 401 if no auth token is provided', async () => {
    const req = {
      headers: {},
    } as any;
    const res = {
      writeHead: jest.fn(),
      write: jest.fn(),
      end: jest.fn(),
    } as any;
    const next = jest.fn();

    const middleware = new AuthMiddleware(
      new AuthIdService(new UserMemoryService()),
    );

    await middleware.use(req, res, next);

    expect(res.writeHead).toHaveBeenCalledWith(401, {
      'Content-Type': 'application/json',
    });
    expect(res.write).toHaveBeenCalledWith(
      JSON.stringify({
        statusCode: 401,
        message: 'Unauthorized',
      }),
    );
    expect(res.end).toHaveBeenCalled();
  });
});
