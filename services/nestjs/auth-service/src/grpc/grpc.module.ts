import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { GrpcClassesProfile } from './grpc.profile';

@Module({
  imports: [AuthModule],
  providers: [GrpcClassesProfile],
})
export class GrpcModule {}
