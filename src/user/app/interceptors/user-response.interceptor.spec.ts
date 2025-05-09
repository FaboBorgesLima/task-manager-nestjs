import { UserResponseInterceptor } from './user-response.interceptor';

describe('UserInterceptor', () => {
  it('should be defined', () => {
    expect(new UserResponseInterceptor()).toBeDefined();
  });
});
