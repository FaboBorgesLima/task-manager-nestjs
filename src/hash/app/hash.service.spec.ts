import { Test, TestingModule } from '@nestjs/testing';
import { HashService } from './hash.service';

describe('Hash', () => {
  let provider: HashService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HashService],
    }).compile();

    provider = module.get<HashService>(HashService);
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
