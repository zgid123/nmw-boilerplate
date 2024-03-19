import { AuthGuard } from '@nestjs/passport';
import { createMetadata } from '@grpc.ts/nestjs-client';
import {
  Injectable,
  SetMetadata,
  UnauthorizedException,
  type CanActivate,
  type CustomDecorator,
  type ExecutionContext,
} from '@nestjs/common';

import type { Reflector } from '@nestjs/core';
import type { IAuthService } from '@data/grpc/auth';

const IS_PUBLIC_KEY = 'isPublic';

export function Public(): CustomDecorator<string> {
  return SetMetadata(IS_PUBLIC_KEY, true);
}

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}

@Injectable()
export class GrpcAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authService: IAuthService,
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const bearerToken = context
      .switchToHttp()
      .getRequest()
      .headers['authorization']?.replace(/Bearer /gi, '');

    const response = await this.authService.getProfile(
      {},
      createMetadata({
        authToken: bearerToken,
      }),
    );

    if (!response) {
      throw new UnauthorizedException();
    }

    context.switchToHttp().getRequest().user = response;

    return true;
  }
}
