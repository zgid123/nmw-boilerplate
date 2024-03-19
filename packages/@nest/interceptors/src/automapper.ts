import {
  typeConverter,
  type Dictionary,
  type MappingConfiguration,
} from '@automapper/core';
import {
  GrpcTimestamp,
  dateToGrpcTimestamp,
  grpcTimestampToDate,
} from '@grpc.ts/core';

export * from '@automapper-add-on/classes';
export * from '@automapper-add-on/mikro-premap';
export * from '@automapper/core';
export * from '@automapper/nestjs';

export function dateToGrpcTimestampConverter<
  TSource extends Dictionary<TSource>,
  TDestination extends Dictionary<TDestination>,
>(): MappingConfiguration<TSource, TDestination> {
  return typeConverter(Date, GrpcTimestamp, (date) => {
    return dateToGrpcTimestamp(date) as unknown as GrpcTimestamp;
  });
}

export function grpcTimestampToDateConverter<
  TSource extends Dictionary<TSource>,
  TDestination extends Dictionary<TDestination>,
>(): MappingConfiguration<TSource, TDestination> {
  return typeConverter(GrpcTimestamp, Date, (grpcTimestamp) => {
    return grpcTimestampToDate(grpcTimestamp);
  });
}
