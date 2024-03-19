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
import { AllowedToken } from '~/db/models/AllowedToken';
import { SignUserService } from '~/grpc/auth/services/SignUserService';

const userParams: Partial<User> = {
  password: '123123',
  email: 'test@gmail.com',
};

describe('[Auth Service]: gRPC/Auth/Services/SignUserService', () => {
  let user: User;
  let orm: MikroORM;
  let signUserService: SignUserService;

  beforeAll(async () => {
    vi.stubEnv('JWT_SECRET', 'test_secret');

    const { orm: ormInstance, module } = await createModule({
      ormType: 'mikro',
      providers: [SignUserService],
      orm: {
        entities: [User, AllowedToken],
        dbNameAffix: 'grpc_auth_sign_user_service',
      },
    });

    orm = ormInstance;
    signUserService = module.get<SignUserService>(SignUserService);

    await createDatabase(orm);
    const { hash } = await bcryptHash({ source: userParams.password });

    user = create(orm, User, {
      uid: nanoid(),
      password: hash,
      email: userParams.email,
    });

    await orm.em.flush();
  });

  afterAll(async () => {
    await dropDatabase(orm);
    await orm.close();

    vi.resetAllMocks();
    vi.unstubAllEnvs();
  });

  describe('#exec', () => {
    it('generates tokens', async () => {
      const { authToken, refreshToken } = await signUserService.exec({
        user,
      });

      const allowedTokenNumber = await orm.em.count(AllowedToken);

      expect(authToken).toBeDefined();
      expect(refreshToken).toBeDefined();
      expect(allowedTokenNumber).toBe(1);
    });
  });
});
