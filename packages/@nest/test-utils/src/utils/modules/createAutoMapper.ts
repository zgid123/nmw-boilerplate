import { classes } from '@automapper-add-on/classes';
import { AutomapperModule } from '@automapper/nestjs';
import { mikro } from '@automapper-add-on/mikro-premap';

import type { DynamicModule } from '@nestjs/common';
import type { Constructor, MappingStrategyInitializer } from '@automapper/core';

export type TAutoMapperStrategy = 'mikro' | 'classes';

export interface ICreateAutoMapperParams<T extends TAutoMapperStrategy> {
  default?: T;
  others?: Array<Exclude<TAutoMapperStrategy, T>>;
}

function getAutoMapperStrategy(
  strategy: TAutoMapperStrategy,
): MappingStrategyInitializer<Constructor> {
  switch (strategy) {
    case 'mikro':
      return mikro();
    default:
      return classes();
  }
}

export function createAutoMapper<T extends TAutoMapperStrategy>(
  params: ICreateAutoMapperParams<T>,
): Array<DynamicModule> {
  if (!params) {
    return [];
  }

  const { others = [], default: defaultStrategy } = params;

  return [
    AutomapperModule.forRoot([
      {
        name: 'default',
        strategyInitializer: getAutoMapperStrategy(defaultStrategy),
      },
      ...others.map((otherStrategy) => {
        return {
          name: otherStrategy,
          strategyInitializer: getAutoMapperStrategy(otherStrategy),
        };
      }),
    ]),
  ];
}
