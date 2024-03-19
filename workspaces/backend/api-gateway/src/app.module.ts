import { Module } from '@nestjs/common';
import { RouterModule, type Routes } from '@nestjs/core';
import { AutomapperModule, classes } from '@nest/interceptors/automapper';

import { AppController } from '~/app.controller';
import { AuthModule, authRoutes } from '~/api/auth/auth.module';

const routes: Routes = [authRoutes];

@Module({
  imports: [
    AutomapperModule.forRoot({
      strategyInitializer: classes(),
    }),
    RouterModule.register(routes),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
