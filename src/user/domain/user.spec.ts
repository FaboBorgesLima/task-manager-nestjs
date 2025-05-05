import { faker } from '@faker-js/faker/.';
import { HashService } from '../../hash/app/hash.service';
import { User } from './user';
import { HashMockService } from '../../hash/app/hash-mock.service';

describe('User', () => {
  const hashService = HashMockService.getInstance();
  it('should be defined', () => {
    expect(
      new User({
        name: 'name',
        email: 'email@email.com',
        password: faker.internet.password(),
      }),
    ).toBeDefined();
  });

  it('should create a user', () => {
    const user = User.create(
      {
        name: 'name',
        email: 'email@email.com',
        password: faker.internet.password(),
      },
      hashService,
    );
    expect(user).toBeDefined();
    expect(user.id).toBeUndefined();
    expect(user.getEmail()).toEqual('email@email.com');
    expect(user.getName()).toEqual('name');
  });

  it('should throw an error if email is invalid', () => {
    expect(() => {
      User.create(
        {
          name: 'name',
          email: 'invalid-email',
          password: 'password',
        },
        hashService,
      );
    }).toThrow();
  });
  it('should throw an error if password is invalid', () => {
    const hash = new HashService();
    expect(() => {
      User.create(
        {
          name: 'name',
          email: 'email@email.com',
          password: 'short',
        },
        hashService,
      );
    }).toThrow();
  });
});
