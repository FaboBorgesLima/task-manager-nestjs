import { faker } from '@faker-js/faker/.';
import { User } from '../user/domain/user';
import { UserMemoryService } from '../user/infra/services/user-memory.service';
import { UserByIdPipe } from './user-by-id.pipe';

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
      User.create({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      }),
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
      User.create({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      }),
    );
    const result = await pipe.transform(user.id, {
      type: 'param',
      data: 'user',
      metatype: String,
    });
    expect(result).toEqual(user);
  });
});
