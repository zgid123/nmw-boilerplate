import { Reflector } from '@nestjs/core';
import { request } from '@nest/test-utils/e2e';
import { createModule } from '@nest/test-utils/utils';
import { grpcClientToken } from '@grpc.ts/nestjs-client';
import { grpcOptions, loadProto } from '@cjs/grpc-utils';
import { unauthorizedCode } from '@nest/interceptors/core';
import { AUTH_SERVICE, PACKAGE_NAME } from '@data/grpc/auth';
import { HttpStatus, type INestApplication } from '@nestjs/common';

import { GrpcAuthGuard } from '~/commons/guard';
import { AuthProfile } from '~/api/auth/auth.profile';
import { ExceptionFilter } from '~/commons/ExceptionFilter';
import { AuthController } from '~/api/auth/auth.controller';
import { LocalStrategy } from '~/api/auth/strategies/local.strategy';

import { mockAuthService, mockUser } from './mockService';

describe('[API Gateway]: AuthController', () => {
  let app: INestApplication;

  beforeAll(async () => {
    ({ app } = await createModule({
      autoMapper: {
        default: 'classes',
      },
      grpc: {
        client: {
          ...grpcOptions,
          url: 'localhost:3001',
          package: {
            packageName: PACKAGE_NAME,
            protoPath: loadProto('auth'),
          },
        },
      },
      mock: {
        providers: [
          {
            token: grpcClientToken({
              serviceName: AUTH_SERVICE,
              packageName: PACKAGE_NAME,
            }),
            value: mockAuthService,
          },
        ],
      },
      enable: {
        interceptors: true,
        exceptions: new ExceptionFilter(),
      },
      controllers: [AuthController],
      providers: [LocalStrategy, AuthProfile],
    }));

    const reflector = app.get(Reflector);
    const authGrpcService = app.get(
      grpcClientToken({
        serviceName: AUTH_SERVICE,
        packageName: PACKAGE_NAME,
      }),
    );
    app.useGlobalGuards(new GrpcAuthGuard(reflector, authGrpcService));

    await app.init();
  });

  describe('POST /auth', () => {
    suite('with correct credentials', () => {
      it('returns user', () => {
        return request(app.getHttpServer())
          .post('/auth')
          .send({
            email: 'test@gmail.com',
            password: '123123',
          })
          .expect({
            data: mockUser,
          });
      });
    });

    suite('with incorrect email', () => {
      it('responds error', () => {
        return request(app.getHttpServer())
          .post('/auth')
          .send({
            email: 'test1@gmail.com',
            password: '123123',
          })
          .expect({
            code: unauthorizedCode,
            status: HttpStatus.UNAUTHORIZED,
            message: 'You are unauthorized.',
          });
      });
    });

    suite('with incorrect password', () => {
      it('responds error', () => {
        return request(app.getHttpServer())
          .post('/auth')
          .send({
            email: 'test@gmail.com',
            password: '1123123',
          })
          .expect({
            code: unauthorizedCode,
            status: HttpStatus.UNAUTHORIZED,
            message: 'You are unauthorized.',
          });
      });
    });
  });

  describe('GET /auth/profile', () => {
    suite('with valid authToken', () => {
      it('returns user', () => {
        return request(app.getHttpServer())
          .get('/auth/profile')
          .set({
            Authorization: `Bearer ${mockUser.authToken}`,
          })
          .expect({
            data: mockUser.profile,
          });
      });
    });

    suite('with invalid authToken', () => {
      it('responds error', () => {
        return request(app.getHttpServer())
          .get('/auth/profile')
          .set({
            Authorization: 'Bearer 123123',
          })
          .expect({
            code: unauthorizedCode,
            status: HttpStatus.UNAUTHORIZED,
            message: 'You are unauthorized.',
          });
      });
    });
  });

  afterAll(async () => {
    vi.resetAllMocks();

    await app.close();
  });
});
