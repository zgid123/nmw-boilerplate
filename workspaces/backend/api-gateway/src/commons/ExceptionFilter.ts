import { status } from '@grpc.ts/nestjs-client';
import {
  isGrpcException,
  ExceptionFilter as BaseExceptionFilter,
} from '@nest/interceptors/core';
import {
  Catch,
  UnauthorizedException,
  type ArgumentsHost,
  type HttpException,
  type ExceptionFilter as NestExceptionFilter,
} from '@nestjs/common';

@Catch()
export class ExceptionFilter
  extends BaseExceptionFilter
  implements NestExceptionFilter
{
  catch(exception: HttpException, host: ArgumentsHost): void {
    if (isGrpcException(exception)) {
      const { code } = exception;

      if (code === status.UNAUTHENTICATED) {
        exception = new UnauthorizedException();
      }
    }

    super.catch(exception, host);
  }
}
