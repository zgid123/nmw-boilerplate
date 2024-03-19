import { Controller } from '@nestjs/common';
import {
  status,
  StatusBuilder,
  GrpcUnaryMethod,
  type Metadata,
  type TUnaryCallback,
  type ServerUnaryCall,
} from '@grpc.ts/nestjs-server';
import {
  roleEnum,
  PACKAGE_NAME,
  AUTH_SERVICE,
  type ISignInRequest,
  type ISignInResponse,
  type IGetProfileResponse,
} from '@data/grpc/auth';

import { User } from '~/db/models/User';
import { extractJWT } from '~/utils/jwt';

import {
  SignInService,
  SignUserService,
  RetrieveUserService,
} from './services';

@Controller()
export class AuthController {
  constructor(
    private readonly signInService: SignInService,
    private readonly signUserService: SignUserService,
    private readonly retrieveUserService: RetrieveUserService,
  ) {}

  @GrpcUnaryMethod({
    serviceName: AUTH_SERVICE,
    options: {
      package: PACKAGE_NAME,
    },
  })
  public async signIn(
    { email, password }: ISignInRequest,
    _metadata: Metadata,
    _call: ServerUnaryCall<unknown, unknown>,
    callback: TUnaryCallback<unknown>,
  ): Promise<ISignInResponse | void> {
    const user = await this.signInService.exec({
      email,
      password,
    });

    if (!user) {
      const error = new StatusBuilder()
        .withCode(status.UNAUTHENTICATED)
        .withDetails('Unauthenticated')
        .build();

      return callback(error, null);
    }

    const { authToken, refreshToken } = await this.signUserService.exec({
      user,
    });

    const { role, ...userInfo } = user;

    return {
      authToken,
      refreshToken,
      profile: {
        ...userInfo,
        role: roleEnum[role],
      },
    };
  }

  @GrpcUnaryMethod({
    serviceName: AUTH_SERVICE,
    options: {
      package: PACKAGE_NAME,
    },
  })
  public async getProfile(
    _request: never,
    metadata: Metadata,
    _call: ServerUnaryCall<unknown, unknown>,
    callback: TUnaryCallback<unknown>,
  ): Promise<IGetProfileResponse | void> {
    const authToken = metadata.get('authToken');
    let user: User;

    try {
      const payload = extractJWT<Record<string, string>>(
        authToken[0].toString(),
      );

      user = await this.retrieveUserService.exec({
        email: payload['sub'],
      });

      if (!user) {
        throw 'User not found';
      }
    } catch {
      const error = new StatusBuilder()
        .withCode(status.UNAUTHENTICATED)
        .withDetails('Unauthenticated')
        .build();

      return callback(error, null);
    }

    return {
      profile: {
        ...user,
        role: roleEnum[user.role],
      },
    };
  }
}
