import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './task.service';
import { TaskRepositoryInterface } from '@faboborgeslima/task-manager-domain/task';
import { TaskMemoryRepository } from '../infra/services/task-memory.repository';
import { UserMemoryRepository } from '../../user/infra/repositories/user-memory.repository';
import { UserRepositoryInterface } from '@faboborgeslima/task-manager-domain/user';

describe('TaskService', () => {
  let service: TaskService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        {
          provide: TaskRepositoryInterface,
          useClass: TaskMemoryRepository,
        },
        {
          provide: UserRepositoryInterface,
          useClass: UserMemoryRepository,
        },
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
