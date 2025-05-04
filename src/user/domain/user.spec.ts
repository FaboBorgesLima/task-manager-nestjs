import { HashMaker } from '../../hash-maker/hash-maker';
import { User } from './user';

describe('User', () => {
  it('should be defined', () => {
    const hash = new HashMaker();
    expect(
      new User({
        name: 'name',
        email: 'email@email.com',
        password: hash.make('password'),
      }),
    ).toBeDefined();
  });

  it('should create a user', () => {
    const hash = new HashMaker();
    const user = User.create({
      name: 'name',
      email: 'email@email.com',
      password: hash.make('password'),
    });
    expect(user).toBeDefined();
    expect(user.id).toBeUndefined();
    expect(user.getEmail()).toEqual('email@email.com');
    expect(user.getName()).toEqual('name');
    expect(user.getPassword()).not.toEqual('password');
    expect(user.getPassword()).toEqual(hash.make('password'));
  });

  it('should throw an error if email is invalid', () => {
    const hash = new HashMaker();
    expect(() => {
      new User({
        name: 'name',
        email: 'invalid-email',
        password: hash.make('password'),
      });
    }).toThrow();
  });

  it('should throw an error if password is not a hash', () => {
    expect(() => {
      new User({
        name: 'name',
        email: 'email@email.com',
        password: 'not-a-hash',
      });
    }).toThrow();
  });
});
