import { nanoid } from 'nanoid';
import { createMetadata } from '@grpc.ts/core';
import { loadProto, grpcOptions } from '@cjs/grpc-utils';
import { PACKAGE_NAME, AUTH_SERVICE, type IAuthService } from '@data/grpc/auth';
import {
  create,
  createModule,
  dropDatabase,
  createDatabase,
  type IGrpcClient,
} from '@nest/test-utils/utils';

import type { MikroORM } from '@cjs/mikro/core';
import type { INestApplication } from '@nestjs/common';

import { User } from '~/db/models/User';
import { bcryptHash } from '~/utils/hash';
import { AllowedToken } from '~/db/models/AllowedToken';
import { AuthController } from '~/grpc/auth/auth.controller';
import {
  SignInService,
  SignUserService,
  RetrieveUserService,
} from '~/grpc/auth/services';

import { jwtToken, nonSubJwtToken } from '../../constants';

const userParams: Partial<User> = {
  password: '123123',
  email: 'test@gmail.com',
};

describe('[Auth Service]: gRPC/AuthController', () => {
  let user: User;
  let orm: MikroORM;
  let app: INestApplication;
  let grpcClient: IGrpcClient;
  let grpcService: IAuthService;

  beforeAll(async () => {
    vi.stubEnv('JWT_SECRET', 'test_secret');

    ({ app, orm, grpcClient } = await createModule({
      ormType: 'mikro',
      controllers: [AuthController],
      providers: [SignInService, SignUserService, RetrieveUserService],
      orm: {
        entities: [User, AllowedToken],
        dbNameAffix: 'grpc_auth_controller',
      },
      grpc: {
        client: {
          ...grpcOptions,
          url: 'localhost:4001',
          package: {
            packageName: PACKAGE_NAME,
            protoPath: loadProto('auth'),
          },
        },
        server: {
          ...grpcOptions,
          url: 'localhost:4001',
          package: [
            {
              packageName: PACKAGE_NAME,
              protoPath: loadProto('auth'),
            },
          ],
        },
      },
    }));

    grpcService = grpcClient[PACKAGE_NAME](AUTH_SERVICE);

    await app.startAllMicroservices();
    await app.init();

    await createDatabase(orm);
    const { hash } = await bcryptHash({ source: userParams.password });

    user = create(orm, User, {
      uid: nanoid(),
      password: hash,
      email: userParams.email,
    });

    await orm.em.flush();
  });

  afterAll(async () => {
    await dropDatabase(orm);
    await orm.close();
    await app.close();

    vi.resetAllMocks();
  });

  describe('gRPC signIn', () => {
    suite('valid password', () => {
      it('responds auth info', async () => {
        const result = await grpcService.signIn({
          email: user.email,
          password: userParams.password,
        });

        expect(result.authToken).toBeDefined();
        expect(result.refreshToken).toBeDefined();
        expect(result.profile.email).toBe('test@gmail.com');
        expect(result.profile.uid).toBeDefined();
        expect(result.profile.role).toBe('user');
      });
    });

    suite('invalid password', () => {
      it('responds error', async () => {
        await expect(() => {
          return grpcService.signIn({
            email: user.email,
            password: '111111',
          });
        }).rejects.toThrowError(/Unauthenticated/);
      });
    });
  });

  describe('gRPC getProfile', () => {
    suite('valid authToken', () => {
      it('responds auth info', async () => {
        const result = await grpcService.getProfile(
          {},
          createMetadata({
            authToken: jwtToken,
          }),
        );

        expect(result.profile).toEqual({
          role: 'user',
          uid: user.uid,
          email: 'test@gmail.com',
        });
      });
    });

    suite('invalid authToken', () => {
      it('responds error', async () => {
        await expect(() => {
          return grpcService.getProfile(
            {},
            createMetadata({
              authToken: 'invalid_token',
            }),
          );
        }).rejects.toThrowError(/Unauthenticated/);
      });
    });

    suite('valid authToken but non-existing sub', () => {
      it('responds error', async () => {
        await expect(() => {
          return grpcService.getProfile(
            {},
            createMetadata({
              authToken: nonSubJwtToken,
            }),
          );
        }).rejects.toThrowError(/Unauthenticated/);
      });
    });
  });
});
