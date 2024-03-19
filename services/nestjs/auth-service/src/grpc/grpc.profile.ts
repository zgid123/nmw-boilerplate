import { Injectable } from '@nestjs/common';
import {
  addProfile,
  InjectMapper,
  AutomapperProfile,
  type Mapper,
} from '@nest/interceptors/automapper';

import { authClassesProfile } from './auth/auth.profile';

@Injectable()
export class GrpcClassesProfile extends AutomapperProfile {
  constructor(@InjectMapper('classes') mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper: Mapper) => {
      addProfile(mapper, authClassesProfile);
    };
  }
}
