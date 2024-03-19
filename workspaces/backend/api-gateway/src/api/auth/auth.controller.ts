import { UseMapperInterceptor } from '@nest/interceptors/core';
import { Request, Controller, Post, UseGuards, Get } from '@nestjs/common';

import { LocalAuthGuard, Public } from '~/commons/guard';

import type { IRequestProps } from '~/interfaces/request';

import {
  AuthVM,
  ProfileVM,
  GrpcProfileVM,
  GrpcSignInResponseVM,
} from './auth.vm';

@Controller('auth')
export class AuthController {
  @Public()
  @UseMapperInterceptor(GrpcSignInResponseVM, AuthVM)
  @UseGuards(LocalAuthGuard)
  @Post()
  public async signIn(
    @Request() req: IRequestProps,
  ): Promise<GrpcSignInResponseVM> {
    return req.user;
  }

  @UseMapperInterceptor(GrpcProfileVM, ProfileVM)
  @Get('/profile')
  public profile(@Request() req: IRequestProps): GrpcProfileVM {
    return req.user.profile;
  }
}
