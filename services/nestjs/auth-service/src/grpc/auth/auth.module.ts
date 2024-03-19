import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';

import { User } from '~/db/models/User';
import { AllowedToken } from '~/db/models/AllowedToken';

import { AuthController } from './auth.controller';
import {
  SignInService,
  SignUserService,
  RetrieveUserService,
} from './services';

@Module({
  imports: [MikroOrmModule.forFeature([User, AllowedToken])],
  controllers: [AuthController],
  providers: [SignInService, SignUserService, RetrieveUserService],
})
export class AuthModule {}
