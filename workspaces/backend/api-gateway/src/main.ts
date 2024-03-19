import { NestFactory, Reflector } from '@nestjs/core';
import { grpcClientToken } from '@grpc.ts/nestjs-client';
import { AUTH_SERVICE, PACKAGE_NAME } from '@data/grpc/auth';
import { ResponseInterceptor } from '@nest/interceptors/core';

import type { LogLevel } from '@nestjs/common';

import '~/env';

import { AppModule } from '~/app.module';
import { GrpcAuthGuard } from '~/commons/guard';
import { ExceptionFilter } from '~/commons/ExceptionFilter';

async function bootstrap() {
  let logLevels: LogLevel[] = ['error', 'log', 'warn'];

  if (['development', 'test'].includes(process.env.NODE_ENV)) {
    logLevels = ['error', 'warn', 'log', 'verbose', 'debug'];
  }

  const app = await NestFactory.create(AppModule, {
    logger: logLevels,
  });

  const reflector = app.get(Reflector);
  const authGrpcService = app.get(
    grpcClientToken({
      serviceName: AUTH_SERVICE,
      packageName: PACKAGE_NAME,
    }),
  );
  app.useGlobalGuards(new GrpcAuthGuard(reflector, authGrpcService));

  app.useGlobalInterceptors(new ResponseInterceptor());

  app.useGlobalFilters(new ExceptionFilter());

  await app.listen(3_000);
}

bootstrap();
