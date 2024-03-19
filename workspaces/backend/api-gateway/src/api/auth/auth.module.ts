import { Module } from '@nestjs/common';
import { PACKAGE_NAME } from '@data/grpc/auth';
import { GrpcClient } from '@grpc.ts/nestjs-client';
import { loadProto, grpcOptions } from '@cjs/grpc-utils';

import type { RouteTree } from '@nestjs/core';

import { AuthProfile } from './auth.profile';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  imports: [
    GrpcClient.register({
      ...grpcOptions,
      url: process.env.AUTH_SERVICE_GRPC_URI,
      package: {
        packageName: PACKAGE_NAME,
        protoPath: loadProto('auth'),
      },
    }),
  ],
  controllers: [AuthController],
  providers: [LocalStrategy, AuthProfile],
})
export class AuthModule {}

export const authRoutes: RouteTree = {
  path: 'api',
  module: AuthModule,
};
