import { MikroORM } from '@cjs/mikro/core';
import { MikroOrmMiddleware, MikroOrmModule } from '@mikro-orm/nestjs';
import {
  mikro,
  classes,
  AutomapperModule,
} from '@nest/interceptors/automapper';
import {
  Module,
  type NestModule,
  type OnModuleInit,
  type MiddlewareConsumer,
} from '@nestjs/common';

import { GrpcModule } from '~/grpc/grpc.module';
import { AppController } from '~/app.controller';

@Module({
  imports: [
    MikroOrmModule.forRoot(),
    AutomapperModule.forRoot([
      {
        name: 'default',
        strategyInitializer: mikro(),
      },
      {
        name: 'classes',
        strategyInitializer: classes(),
      },
    ]),
    GrpcModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule implements NestModule, OnModuleInit {
  constructor(private readonly orm: MikroORM) {}

  async onModuleInit(): Promise<void> {
    await this.orm.getMigrator().up();
  }

  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(MikroOrmMiddleware).forRoutes('*');
  }
}
