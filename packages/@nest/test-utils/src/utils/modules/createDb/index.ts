import type { DynamicModule } from '@nestjs/common';

import { createMikro, type ICreateMikroParams } from './createMikro';

export type TOrmType = 'mikro' | 'none';

export type TCreateDbParams = ICreateMikroParams;

export function createDb(
  ormType: TOrmType,
  params: TCreateDbParams,
): DynamicModule[] {
  switch (ormType) {
    case 'mikro':
      return createMikro(params);
    default:
      return [];
  }
}
