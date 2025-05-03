import { Test, TestingModule } from '@nestjs/testing';
import { HashMaker } from './hash-maker';

describe('Hash', () => {
  let provider: HashMaker;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HashMaker],
    }).compile();

    provider = module.get<HashMaker>(HashMaker);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
  it('should hash a password', () => {
    const password = 'password';
    const hashedPassword = provider.make(password);
    expect(hashedPassword).not.toEqual(password);
  });
  it('should make the same hash', () => {
    const password = 'password';
    const hashedPassword1 = provider.make(password);
    const hashedPassword2 = provider.make(password);
    expect(hashedPassword1).toEqual(hashedPassword2);
  });
});
