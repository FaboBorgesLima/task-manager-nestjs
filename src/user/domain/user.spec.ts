import { HashMaker } from '../../hash-maker/hash-maker';
import { User } from './user';
import { TokenGenerator } from '../../token-generator/token-generator';

describe('User', () => {
  it('should be defined', () => {
    const hash = new HashMaker();
    const tokenGenerator = new TokenGenerator();
    expect(
      new User(
        'name',
        'email@email.com',
        hash.make('password'),
        tokenGenerator.generate(),
      ),
    ).toBeDefined();
  });
});
