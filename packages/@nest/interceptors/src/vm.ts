import { GrpcTimestamp } from '@grpc.ts/core';
import { AutoMap } from '@automapper-add-on/classes';

export class BaseGrpcVM {
  @AutoMap()
  id: number;

  @AutoMap(() => GrpcTimestamp)
  createdAt: GrpcTimestamp;

  @AutoMap(() => GrpcTimestamp)
  updatedAt: GrpcTimestamp;
}
