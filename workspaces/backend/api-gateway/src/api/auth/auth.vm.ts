import { AutoMap } from '@nest/interceptors/automapper';

import type { IProfile, ISignInResponse } from '@data/grpc/auth';

export class GrpcProfileVM implements IProfile {
  @AutoMap()
  firstName?: string;

  @AutoMap()
  lastName?: string;

  @AutoMap()
  email: string;

  @AutoMap()
  uid: string;

  @AutoMap()
  role: number;
}

export class GrpcSignInResponseVM implements ISignInResponse {
  @AutoMap(() => GrpcProfileVM)
  profile: GrpcProfileVM;

  @AutoMap()
  authToken: string;

  @AutoMap()
  refreshToken: string;
}

export class ProfileVM {
  @AutoMap()
  firstName?: string;

  @AutoMap()
  lastName?: string;

  @AutoMap()
  email: string;

  @AutoMap()
  uid: string;

  @AutoMap()
  role: string;
}

export class AuthVM {
  @AutoMap(() => ProfileVM)
  profile: ProfileVM;

  @AutoMap()
  authToken: string;

  @AutoMap()
  refreshToken: string;
}
