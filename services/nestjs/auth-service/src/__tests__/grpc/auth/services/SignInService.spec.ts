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
import { SignInService } from '~/grpc/auth/services/SignInService';

const userParams: Partial<User> = {
  password: '123123',
  email: 'test@gmail.com',
};

describe('[Auth Service]: gRPC/Auth/Services/SignInService', () => {
  let orm: MikroORM;
  let signInService: SignInService;

  beforeAll(async () => {
    const { orm: ormInstance, module } = await createModule({
      ormType: 'mikro',
      providers: [SignInService],
      orm: {
        entities: [User],
        dbNameAffix: 'grpc_auth_sign_in_service',
      },
    });

    orm = ormInstance;
    signInService = module.get<SignInService>(SignInService);

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
    suite('correct password', () => {
      it('returns user', async () => {
        const user = await signInService.exec({
          email: userParams.email,
          password: userParams.password,
        });

        expect(user).toBeDefined();
        expect(user.email).toBe(userParams.email);
      });
    });

    suite('incorrect password', () => {
      it('returns null', async () => {
        const user = await signInService.exec({
          password: '1111111',
          email: userParams.email,
        });

        expect(user).toBeNull();
      });
    });

    suite('non-existing email', () => {
      it('returns null', async () => {
        const user = await signInService.exec({
          password: userParams.password,
          email: 'non_existing@gmail.com',
        });

        expect(user).toBeNull();
      });
    });
  });
});
