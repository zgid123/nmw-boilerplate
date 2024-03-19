import { Strategy } from 'passport-local';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { GrpcService } from '@grpc.ts/nestjs-client';
import {
  AUTH_SERVICE,
  PACKAGE_NAME,
  type IAuthService,
  type ISignInResponse,
} from '@data/grpc/auth';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    @GrpcService({
      packageName: PACKAGE_NAME,
      serviceName: AUTH_SERVICE,
    })
    private readonly authService: IAuthService,
  ) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  public validate(email: string, password: string): Promise<ISignInResponse> {
    return this.authService.signIn({ email, password });
  }
}
