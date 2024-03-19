import { isDate, pick, omit, pipe } from 'remeda';
import { dateToGrpcTimestamp } from '@grpc.ts/nestjs-server';

class Long {
  low: number;
  high: number;
  unsigned: boolean;

  constructor(low: number, high: number, unsigned: boolean) {
    this.low = low;
    this.high = high;
    this.unsigned = unsigned;
  }
}

type TConvertGrpcResponseReturnProps<
  TObject,
  TDateColumns extends Array<keyof TObject>,
> = {
  [key in TDateColumns[number]]: Long;
} & {
  [key in keyof Omit<TObject, TDateColumns[number]>]: TObject[key];
};

interface IConvertGrpcResponseOptionsProps<DateColumns, PickKeys, OmitKeys> {
  pick?: PickKeys;
  omit?: OmitKeys;
  dateColumns?: DateColumns;
}

export function convertGrpcResponse<
  T extends object,
  P extends keyof T,
  PickKeys extends Array<keyof TConvertGrpcResponseReturnProps<T, P[]>>,
  OmitKeys extends Array<Exclude<P, PickKeys[number]>>,
>(
  data: T,
  opts: IConvertGrpcResponseOptionsProps<P[], PickKeys, OmitKeys> = {},
): Omit<
  Pick<TConvertGrpcResponseReturnProps<T, P[]>, PickKeys[number]>,
  OmitKeys[number]
> {
  const { dateColumns, pick: pickKeys, omit: omitKeys } = opts;

  const normalizedObject: Omit<
    Pick<T, PickKeys[number]>,
    OmitKeys[number]
  > = pipe(data, pick(pickKeys || []), omit(omitKeys || []));

  if (!dateColumns || !dateColumns.length) {
    return normalizedObject as Omit<
      Pick<TConvertGrpcResponseReturnProps<T, P[]>, PickKeys[number]>,
      OmitKeys[number]
    >;
  }

  const groupedCols = dateColumns.reduce<Record<string, string>>(
    (result, col) => {
      const colAsString = col.toString();
      result[colAsString] = colAsString;

      return result;
    },
    {},
  );

  return Object.entries(normalizedObject).reduce(
    (result, [key, value]) => {
      if (!groupedCols[key] || !isDate(value)) {
        result[key] = value;

        return result;
      }

      const { seconds } = dateToGrpcTimestamp(value);

      result[key] = {
        nanos: 0,
        seconds: new Long(seconds.low, 0, false),
      };
    },
    {} as Omit<
      Pick<TConvertGrpcResponseReturnProps<T, P[]>, PickKeys[number]>,
      OmitKeys[number]
    >,
  );
}
