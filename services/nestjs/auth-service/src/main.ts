import { NestFactory } from '@nestjs/core';
import { PACKAGE_NAME } from '@data/grpc/auth';
import { GrpcServer } from '@grpc.ts/nestjs-server';
import { loadProto, grpcOptions } from '@cjs/grpc-utils';

import type { LogLevel } from '@nestjs/common';

import '~/env';

import { AppModule } from '~/app.module';

async function bootstrap() {
  let logLevels: LogLevel[] = ['error', 'log', 'warn'];

  if (['development', 'test'].includes(process.env.NODE_ENV)) {
    logLevels = ['error', 'warn', 'log', 'verbose', 'debug'];
  }

  const app = await NestFactory.create(AppModule, {
    logger: logLevels,
  });

  app.enableCors();
  app.enableShutdownHooks();

  app.connectMicroservice(
    GrpcServer.createService([
      {
        ...grpcOptions,
        url: 'localhost:4001',
        package: [
          {
            packageName: PACKAGE_NAME,
            protoPath: loadProto('auth'),
          },
        ],
      },
    ]),
  );

  await app.startAllMicroservices();
  await app.listen(4_000);
}

bootstrap();
