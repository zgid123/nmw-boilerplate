import type { EntityName, MikroORM, RequiredEntityData } from '@cjs/mikro/core';

export async function createDatabase(orm: MikroORM): Promise<void> {
  const generator = orm.getSchemaGenerator();

  await generator.ensureDatabase();
  await generator.updateSchema();
}

export async function dropDatabase(orm: MikroORM): Promise<void> {
  const { dbName } = orm.config.getAll();

  await orm.getSchemaGenerator().dropDatabase(dbName || 'nmw_boilerplate_test');
}

export async function truncateAllTables(orm: MikroORM): Promise<void> {
  await orm.getSchemaGenerator().refreshDatabase();
}

export function create<T extends object>(
  orm: MikroORM,
  entityClass: EntityName<T>,
  params: RequiredEntityData<T>,
): T {
  const repo = orm.em.getRepository<T>(entityClass);
  const record = repo.create(params);

  repo.getEntityManager().persist(record);

  return record;
}
