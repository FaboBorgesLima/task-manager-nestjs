import { UserEntity } from '../../src/user/infra/user.entity';
import datasource from '../../src/database/datasource';
import { TaskEntity } from '../../src/task/infra/task.entity';

export async function clearDatabase() {
  await datasource.initialize();

  const taskRepo = datasource.getRepository(TaskEntity);

  for (const entity of await taskRepo.find()) {
    await taskRepo.remove(entity);
  }

  const userRepo = datasource.getRepository(UserEntity);

  for (const entity of await userRepo.find()) {
    await userRepo.remove(entity);
  }

  await datasource.destroy();
}
