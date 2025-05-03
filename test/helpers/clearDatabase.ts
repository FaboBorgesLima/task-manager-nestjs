import datasource from '../../src/database/datasource';

export async function clearDatabase() {
  await datasource.initialize();
  for (const entity of datasource.entityMetadatas) {
    const repository = datasource.getRepository(entity.name);
    await repository.delete({});
  }
  await datasource.destroy();
}
