import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserMemoryRepository } from '../infra/repositories/user-memory.repository';
import { UserRepository } from '../domain/user.repository';

describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserRepository,
          useClass: UserMemoryRepository,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
