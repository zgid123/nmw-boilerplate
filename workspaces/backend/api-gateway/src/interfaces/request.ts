import type { ISignInResponse } from '@data/grpc/auth';

export interface IRequestProps {
  user: ISignInResponse;
}
