import { Metadata, type StatusObject } from '@grpc.ts/core';

export function isGrpcException(exception: TAny): exception is StatusObject {
  const { metadata } = (exception || {}) as StatusObject;

  return metadata instanceof Metadata;
}
