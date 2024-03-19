import { MikroORM } from '@cjs/mikro/core';
import { grpcClientToken } from '@grpc.ts/nestjs-client';
import { Test, type TestingModule } from '@nestjs/testing';
import { ExceptionFilter, ResponseInterceptor } from '@nest/interceptors/core';

import type {
  ModuleMetadata,
  INestApplication,
  ExceptionFilter as NestExceptionFilter,
} from '@nestjs/common';
import type {
  IGrpcClientProps,
  IGrpcServerProps,
} from '@grpc.ts/core/lib/interface';

import {
  createDb,
  createGrpcClient,
  createAutoMapper,
  createGrpcServer,
  type TOrmType,
  type TCreateDbParams,
  type TAutoMapperStrategy,
  type ICreateAutoMapperParams,
} from './modules';

interface IGrpcOptionsProps {
  client?: IGrpcClientProps;
  server?: IGrpcServerProps;
}

interface ICreateModuleParams<
  T extends TOrmType,
  P extends TAutoMapperStrategy,
  TGrpc extends IGrpcOptionsProps,
> extends ModuleMetadata {
  ormType?: T;
  grpc?: TGrpc;
  autoMapper?: ICreateAutoMapperParams<P>;
  mock?: {
    providers?: Array<{
      token: TAny;
      value: TAny;
    }>;
  };
  enable?: {
    interceptors?: true;
    exceptions?: true | NestExceptionFilter | NestExceptionFilter[];
  };
}

interface ICreateModuleReturnProps {
  app: INestApplication;
  module: TestingModule;
}

export interface IGrpcClient {
  [key: string]: <T>(service: string) => T;
}

type TCreateModuleParams<
  T extends TOrmType,
  P extends TAutoMapperStrategy,
  TGrpc extends IGrpcOptionsProps,
> = T extends 'mikro'
  ? ICreateModuleParams<T, P, TGrpc> & { orm: TCreateDbParams }
  : ICreateModuleParams<T, P, TGrpc>;

type TCreateModuleReturn<
  T extends TOrmType,
  TGrpc extends IGrpcOptionsProps,
  TOrmReturn = T extends 'mikro'
    ? ICreateModuleReturnProps & { orm: MikroORM }
    : ICreateModuleReturnProps,
  TGrpcReturn = TGrpc extends undefined
    ? TOrmReturn
    : TOrmReturn & { grpcClient: IGrpcClient },
> = TGrpcReturn;

export async function createModule<
  T extends TOrmType,
  P extends TAutoMapperStrategy,
  TGrpc extends IGrpcOptionsProps,
>({
  mock,
  grpc,
  enable,
  ormType,
  autoMapper,
  imports = [],
  ...rest
}: TCreateModuleParams<T, P, TGrpc>): Promise<TCreateModuleReturn<T, TGrpc>> {
  const { orm, ...others } = rest as TCreateModuleParams<T, P, TGrpc> & {
    orm: TCreateDbParams;
  };

  const { client, server } = grpc || {};
  const { providers } = mock || {};

  const builder = Test.createTestingModule({
    ...others,
    imports: [
      ...imports,
      ...createDb(ormType, orm),
      ...createGrpcClient(client),
      ...createAutoMapper(autoMapper),
    ],
  });

  if (providers?.length) {
    providers.forEach(({ token, value }) => {
      builder.overrideProvider(token).useValue(value);
    });
  }

  const module = await builder.compile();

  const app = module.createNestApplication();

  createGrpcServer({
    app,
    server,
  });

  const result: TAny = {
    app,
    module,
  };

  if (grpc) {
    result.grpcClient = {};
    let clientPackages = client.package;

    if (!Array.isArray(clientPackages)) {
      clientPackages = [clientPackages];
    }

    clientPackages.forEach((clientPackage) => {
      result.grpcClient[clientPackage.packageName] = (service: string) => {
        return module.get(
          grpcClientToken({
            serviceName: service,
            clientName: client.clientName,
            packageName: clientPackage.packageName,
          }),
        );
      };
    });
  }

  const { interceptors = false } = enable || {};
  let { exceptions = false } = enable || {};

  if (interceptors) {
    app.useGlobalInterceptors(new ResponseInterceptor());
  }

  if (exceptions) {
    if (typeof exceptions === 'boolean') {
      exceptions = new ExceptionFilter();
    }

    if (!Array.isArray(exceptions)) {
      exceptions = [exceptions];
    }

    app.useGlobalFilters(...exceptions);
  }

  switch (ormType) {
    case 'mikro': {
      const orm = module.get<MikroORM>(MikroORM);

      return {
        ...result,
        orm,
      };
    }
    default:
      return result;
  }
}
