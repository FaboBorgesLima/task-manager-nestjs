import { AuthIdRepository } from '../../infra/repositories/auth-id.repository';
import { AuthMiddleware } from './auth.middleware';
import { UserMemoryRepository } from '../../../user/infra/repositories/user-memory.repository';
import { createRequest, createResponse } from 'node-mocks-http';

describe('AuthMiddleware', () => {
  it('should be defined', () => {
    expect(
      new AuthMiddleware(new AuthIdRepository(new UserMemoryRepository())),
    ).toBeDefined();
  });
  it('should return 401 if no auth token is provided', async () => {
    const middleware = new AuthMiddleware(
      new AuthIdRepository(new UserMemoryRepository()),
    );
    const req = createRequest({
      headers: {},
    });
    const res = createResponse();

    // Mock the response methods
    /* eslint-disable @typescript-eslint/unbound-method */
    jest.spyOn(res, 'writeHead');
    jest.spyOn(res, 'write');
    jest.spyOn(res, 'end');

    const next = jest.fn();

    await middleware.use(req, res, next.bind(next) as () => void);

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
    /* eslint-enable @typescript-eslint/unbound-method */
  });
});
