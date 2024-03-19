import { config } from '@cjs/mikro/config';
import { combine } from '@core/utils/stringUtils';
import { MikroOrmModule } from '@mikro-orm/nestjs';

import type { DynamicModule } from '@nestjs/common';
import type { AnyEntity, EntityName, MikroORMOptions } from '@cjs/mikro/core';

export interface ICreateMikroParams {
  dbNameAffix?: string;
  entities: MikroORMOptions['entities'];
}

export function createMikro({
  entities,
  dbNameAffix,
}: ICreateMikroParams): DynamicModule[] {
  return [
    MikroOrmModule.forRoot(
      config({
        entities,
        entitiesTs: entities,
        allowGlobalContext: true,
        dynamicDatabaseName: true,
        dbName: combine({ joinWith: '_' }, 'cap_vault_test', dbNameAffix),
      }),
    ),
    MikroOrmModule.forFeature(entities as EntityName<AnyEntity>[]),
  ];
}
