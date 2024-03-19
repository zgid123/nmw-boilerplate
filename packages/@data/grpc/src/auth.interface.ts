/* eslint-disable @typescript-eslint/ban-types */
import type { Metadata, ServiceClient } from '@grpc.ts/core';

export const PACKAGE_NAME = 'auth';

export const roleEnum = {
  admin: 0,
  user: 1,
};

export const roleEnumMapper = {
  0: 'admin',
  1: 'user',
};

export type TRoleEnum = 'admin' | 'user';

export interface IProfile {
  firstName?: string;
  lastName?: string;
  email: string;
  uid: string;
  role: number;
}

export interface ISignInResponse {
  authToken: string;
  refreshToken: string;
  profile: IProfile;
}

export interface ISignInRequest {
  email: string;
  password: string;
}

export interface IGetProfileResponse {
  profile: IProfile;
}

export const AUTH_SERVICE = 'AuthService';

export interface IAuthService extends ServiceClient {
  SignIn(params: ISignInRequest, metadata?: Metadata): Promise<ISignInResponse>;
  signIn(params: ISignInRequest, metadata?: Metadata): Promise<ISignInResponse>;
  GetProfile(params: {}, metadata?: Metadata): Promise<IGetProfileResponse>;
  getProfile(params: {}, metadata?: Metadata): Promise<IGetProfileResponse>;
}
