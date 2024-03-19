import uniqid from 'uniqid';
import { SeedManager } from '@mikro-orm/seeder';
import { Migrator } from '@mikro-orm/migrations';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { EntityGenerator } from '@mikro-orm/entity-generator';
import { defineConfig, type MikroORMOptions } from '@mikro-orm/core';

import { MikroNamingStrategy } from './strategy';

interface IConfigParams {
  dbName?: string;
  allowGlobalContext?: boolean;
  dynamicDatabaseName?: boolean;
  entities?: MikroORMOptions['entities'];
  entitiesTs?: MikroORMOptions['entitiesTs'];
  extensions?: MikroORMOptions['extensions'];
}

export type TMikroConfig = Partial<MikroORMOptions>;

export function config({
  dbName,
  extensions = [],
  dynamicDatabaseName,
  allowGlobalContext = false,
  entities = ['./dist/db/models'],
  entitiesTs = ['./src/db/models'],
}: IConfigParams = {}): TMikroConfig {
  dbName ||= process.env.DB_NAME || 'nmw_boilerplate_development';
  const driverInstance: MikroORMOptions['driver'] = PostgreSqlDriver;

  if (dynamicDatabaseName) {
    dbName = `${dbName || 'nmw_boilerplate_test'}_${uniqid()}`;
  }

  return defineConfig({
    dbName,
    entities,
    entitiesTs,
    allowGlobalContext,
    driver: driverInstance,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    namingStrategy: MikroNamingStrategy,
    port: parseInt(process.env.DB_PORT || '', 10),
    debug: process.env.NODE_ENV === 'development',
    extensions: [Migrator, EntityGenerator, SeedManager, ...extensions],
    seeder: {
      glob: '!(*.d).{js,ts}',
      path: './dist/db/seeds',
      pathTs: './src/db/seeds',
    },
    migrations: {
      path: './dist/db/migrations',
      pathTs: './src/db/migrations',
    },
  });
}
