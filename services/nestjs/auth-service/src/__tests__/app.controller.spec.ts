import { request } from '@nest/test-utils/e2e';
import { createModule } from '@nest/test-utils/utils';

import type { INestApplication } from '@nestjs/common';

import { AppController } from '~/app.controller';

describe('[Auth Service]: AppController', () => {
  let app: INestApplication;

  beforeAll(async () => {
    ({ app } = await createModule({
      controllers: [AppController],
    }));

    await app.init();
  });

  it('GET /health', () => {
    return request(app.getHttpServer())
      .get('/health')
      .expect(200)
      .expect('Ok!');
  });

  afterAll(async () => {
    await app.close();
  });
});
