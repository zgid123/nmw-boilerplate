import { GrpcClient } from '@grpc.ts/nestjs-client';

import type { DynamicModule } from '@nestjs/common';
import type { IGrpcClientProps } from '@grpc.ts/core/lib/interface';

export function createGrpcClient(
  client: IGrpcClientProps,
): Array<DynamicModule | Promise<DynamicModule>> {
  const modules: Array<DynamicModule | Promise<DynamicModule>> = [];

  if (client) {
    modules.push(GrpcClient.register(client));
  }

  return modules;
}
