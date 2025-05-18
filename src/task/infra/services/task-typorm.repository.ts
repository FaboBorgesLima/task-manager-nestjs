import { TaskRepositoryInterface } from '../../domain/task.repository.interface';
import { TaskEntity } from '../task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Or, Repository } from 'typeorm';
import { Task } from '../../domain/task';
import { TaskAdapter } from '../task-adapter';

export class TaskTypeORMRepository implements TaskRepositoryInterface {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly taskRepository: Repository<TaskEntity>,
  ) {}

  async save(task: Task): Promise<Task> {
    return TaskAdapter.fromEntity(
      await this.taskRepository.save(TaskAdapter.fromDomain(task).toEntity()),
    ).toDomain();
  }

  async findById(id: string): Promise<Task | void> {
    if (!id) return;
    const taskEntity = await this.taskRepository.findOne({ where: { id } });
    if (!taskEntity) return;
    return TaskAdapter.fromEntity(taskEntity).toDomain();
  }

  async findByUser(userId: string): Promise<Task[]> {
    if (!userId) return [];

    const tasks = await this.taskRepository.find({ where: { userId } });
    return tasks.map((task) => TaskAdapter.fromEntity(task).toDomain());
  }

  async findByUserAndDate(
    userId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<Task[]> {
    Or();
    const tasks = await this.taskRepository
      .createQueryBuilder('task')
      .where('task.userId = :userId', { userId })
      .andWhere(
        '(task.start BETWEEN :startDate AND :endDate OR task.end BETWEEN :startDate AND :endDate)',
        { startDate, endDate },
      )
      .getMany();

    return tasks.map((task) => TaskAdapter.fromEntity(task).toDomain());
  }

  async delete(id: string): Promise<void> {
    await this.taskRepository.delete(id);
  }
}
