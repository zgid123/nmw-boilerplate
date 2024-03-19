import { AutoMap } from '@nest/interceptors/automapper';

import { User } from '~/db/models/User';

export class ProfileGrpcVM {
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

export class SignInResponseVM {
  @AutoMap()
  authToken: string;

  @AutoMap()
  refreshToken: string;

  @AutoMap(() => User)
  profile: User;
}

export class SignInResponseGrpcVM {
  @AutoMap()
  authToken: string;

  @AutoMap()
  refreshToken: string;

  @AutoMap(() => ProfileGrpcVM)
  profile: ProfileGrpcVM;
}
