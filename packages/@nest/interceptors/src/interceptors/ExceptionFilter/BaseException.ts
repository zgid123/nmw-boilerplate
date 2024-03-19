import { HttpException, HttpStatus } from '@nestjs/common';

import type { IExceptionProps } from './interface';

export class BaseException extends HttpException {
  public code: number;

  constructor({
    code = 10_000,
    message = 'Something went wrong!',
    status = HttpStatus.INTERNAL_SERVER_ERROR,
  }: IExceptionProps = {}) {
    super(message, status);

    this.code = code;
  }
}
