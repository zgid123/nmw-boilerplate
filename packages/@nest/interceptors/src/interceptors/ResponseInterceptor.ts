import { map } from 'rxjs/operators';
import {
  Injectable,
  SetMetadata,
  type CallHandler,
  type NestInterceptor,
  type CustomDecorator,
  type ExecutionContext,
} from '@nestjs/common';

import type { Observable } from 'rxjs';

interface IResponseProps<T> {
  data: T;
  meta?: Record<string, unknown>;
}

interface IMetadataResponseProps<T> {
  data: T;
  meta: Record<string, unknown>;
}

const SKIP_RESPONSE = 'skipResponse';

export function SkipResponseInterceptor(): CustomDecorator<string> {
  return SetMetadata(SKIP_RESPONSE, true);
}

export function respond<T>(
  data: T | IMetadataResponseProps<T>,
): IResponseProps<T> {
  if (
    !!data &&
    typeof data === 'object' &&
    Object.prototype.hasOwnProperty.call(data as unknown as object, 'meta')
  ) {
    const { meta, data: datumn } = data as IMetadataResponseProps<T>;

    return {
      data: datumn,
      meta,
    };
  }

  return {
    data: data as T,
  };
}

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, IResponseProps<T>>
{
  public intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<IResponseProps<T>> {
    const skipResponse =
      Reflect.getMetadata(SKIP_RESPONSE, context.getHandler()) ||
      Reflect.getMetadata(SKIP_RESPONSE, context.getClass());

    if (skipResponse) {
      return next.handle();
    }

    return next.handle().pipe(map((data) => respond(data)));
  }
}
