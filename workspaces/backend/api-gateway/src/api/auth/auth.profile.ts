import { Injectable } from '@nestjs/common';
import {
  createMap,
  InjectMapper,
  AutomapperProfile,
  type Mapper,
} from '@nest/interceptors/automapper';

import {
  AuthVM,
  ProfileVM,
  GrpcProfileVM,
  GrpcSignInResponseVM,
} from './auth.vm';

@Injectable()
export class AuthProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper: Mapper) => {
      createMap(mapper, GrpcProfileVM, ProfileVM);
      createMap(mapper, GrpcSignInResponseVM, AuthVM);
    };
  }
}
