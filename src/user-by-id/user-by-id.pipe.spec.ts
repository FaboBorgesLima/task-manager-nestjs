import { faker } from '@faker-js/faker';
import { User } from '@faboborgeslima/task-manager-domain/user';
import { UserMemoryService } from '../user/infra/services/user-memory.service';
import { UserByIdPipe } from './user-by-id.pipe';
import { HashMockService } from '@faboborgeslima/task-manager-domain/hash';

describe('UserByIdPipe', () => {
  const userService = new UserMemoryService();
  it('should be defined', () => {
    expect(new UserByIdPipe(userService)).toBeDefined();
  });

  it('should throw an error if user ID is not provided', async () => {
    const pipe = new UserByIdPipe(userService);
    await expect(() =>
      pipe.transform('', {
        type: 'param',
        data: 'user',
        metatype: String,
      }),
    ).rejects.toThrow();
  });
  it('should throw an error if user ID is not a string', async () => {
    const pipe = new UserByIdPipe(userService);
    await userService.saveOne(
      User.create(
        {
          name: faker.person.fullName(),
          email: faker.internet.email(),
          password: faker.internet.password(),
        },
        HashMockService.getInstance(),
      ),
    );
    await expect(() =>
      pipe.transform(12345678, {
        type: 'param',
        data: 'user',
        metatype: String,
      }),
    ).rejects.toThrow();
  });

  it('should return the user if a valid user ID is provided', async () => {
    const pipe = new UserByIdPipe(userService);

    const user = await userService.saveOne(
      User.create(
        {
          name: faker.person.fullName(),
          email: faker.internet.email(),
          password: faker.internet.password(),
        },
        HashMockService.getInstance(),
      ),
    );
    const result = await pipe.transform(user.id, {
      type: 'param',
      data: 'user',
      metatype: String,
    });
    expect(result).toEqual(user);
  });
});
