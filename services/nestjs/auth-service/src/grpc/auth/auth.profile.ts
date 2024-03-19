import { roleEnum } from '@data/grpc/auth';
import {
  mapFrom,
  createMap,
  forMember,
  dateToGrpcTimestampConverter,
  type MappingProfile,
} from '@nest/interceptors/automapper';

import { User } from '~/db/models/User';

import {
  ProfileGrpcVM,
  SignInResponseVM,
  SignInResponseGrpcVM,
} from './auth.vm';

export const authClassesProfile: MappingProfile = (mapper) => {
  createMap(
    mapper,
    User,
    ProfileGrpcVM,
    dateToGrpcTimestampConverter(),
    forMember(
      (profile) => profile.role,
      mapFrom((user) => roleEnum[user.role]),
    ),
  );

  createMap(
    mapper,
    SignInResponseVM,
    SignInResponseGrpcVM,
    dateToGrpcTimestampConverter(),
  );
};
