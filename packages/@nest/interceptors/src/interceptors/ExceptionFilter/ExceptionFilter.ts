/* eslint-disable no-console */
import {
  Catch,
  type HttpException,
  type ArgumentsHost,
  type ExceptionFilter as NestExceptionFilter,
} from '@nestjs/common';

import type { Response } from 'express';

import { BaseException } from './BaseException';
import {
  forbiddenCode,
  unauthorizedCode,
  internalErrorCode,
} from './commonCodes';

import type { IExceptionProps } from './interface';

@Catch()
export class ExceptionFilter implements NestExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();

    let data: Partial<IExceptionProps> = {
      code: internalErrorCode,
      status: 500,
      message: 'Something went wrong!',
    };

    try {
      const status = exception.getStatus();

      if (exception instanceof BaseException) {
        const { code, message } = exception;

        data = {
          code,
          status,
          message,
        };
      } else {
        switch (exception.name) {
          case 'ForbiddenException': {
            data = {
              code: forbiddenCode,
              status,
              message: 'You are unauthorized to use this resource.',
            };

            break;
          }
          case 'UnauthorizedException': {
            data = {
              code: unauthorizedCode,
              status,
              message: 'You are unauthorized.',
            };

            break;
          }
          default: {
            console.log("ExceptionFilter's exception");
            console.log(exception);
          }
        }
      }

      response.status(status).json(data);
    } catch {
      console.log("ExceptionFilter's exception");
      console.log(exception);

      response.status(500).json(data);
    }
  }
}
