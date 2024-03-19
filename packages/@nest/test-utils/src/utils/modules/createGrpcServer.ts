import { GrpcServer } from '@grpc.ts/nestjs-server';

import type { INestApplication } from '@nestjs/common';
import type { IGrpcServerProps } from '@grpc.ts/core/lib/interface';

interface ICreateGrpcServerParams {
  app: INestApplication;
  server?: IGrpcServerProps;
}

export function createGrpcServer({
  app,
  server,
}: ICreateGrpcServerParams): void {
  if (!server) {
    return;
  }

  app.connectMicroservice(GrpcServer.createService(server));
}
