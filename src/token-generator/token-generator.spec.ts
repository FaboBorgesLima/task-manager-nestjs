import { Test, TestingModule } from '@nestjs/testing';
import { TokenGenerator } from './token-generator';

describe('TokenGenerator', () => {
  let provider: TokenGenerator;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TokenGenerator],
    }).compile();

    provider = module.get<TokenGenerator>(TokenGenerator);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });

  it('should generate a token with the correct length', () => {
    const token = provider.generate();
    expect(token).toHaveLength(36);
  });
  it('should generate unique tokens', () => {
    const token1 = provider.generate();
    const token2 = provider.generate();
    expect(token1).not.toEqual(token2);
  });
  it('should generate a token with the correct format', () => {
    const token = provider.generate();
    expect(token).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
    );
  });
});
