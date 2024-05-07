import { nanoid } from 'nanoid';
import {
  create,
  createModule,
  dropDatabase,
  createDatabase,
} from '@nest/test-utils/utils';

import type { MikroORM } from '@cjs/mikro/core';

import { User } from '~/db/models/User';
import { bcryptHash } from '~/utils/hash';
import { RetrieveUserService } from '~/grpc/auth/services/RetrieveUserService';

const userParams: Partial<User> = {
  password: '123123',
  email: 'test@gmail.com',
};

describe('[Auth Service]: gRPC/Auth/Services/RetrieveUserService', () => {
  let orm: MikroORM;
  let retrieveUserService: RetrieveUserService;

  beforeAll(async () => {
    const { orm: ormInstance, module } = await createModule({
      ormType: 'mikro',
      providers: [RetrieveUserService],
      orm: {
        entities: [User],
        dbNameAffix: 'grpc_auth_get_user_service',
      },
    });

    orm = ormInstance;
    retrieveUserService = module.get<RetrieveUserService>(RetrieveUserService);

    await createDatabase(orm);
    const { hash } = await bcryptHash({ source: userParams.password });

    create(orm, User, {
      uid: nanoid(),
      password: hash,
      email: userParams.email,
    });

    await orm.em.flush();
  });

  afterAll(async () => {
    await dropDatabase(orm);
    await orm.close();
  });

  describe('#exec', () => {
    suite('existing email', () => {
      it('returns user', async () => {
        const user = await retrieveUserService.exec({
          email: userParams.email,
        });

        expect(user).toBeDefined();
        expect(user.email).toBe(userParams.email);
      });
    });

    suite('non-existing email', () => {
      it('returns null', async () => {
        const user = await retrieveUserService.exec({
          email: 'non_existing_email@gmail.com',
        });

        expect(user).toBeNull();
      });
    });
  });
});
