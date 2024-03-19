import { JsonWebTokenError } from 'jsonwebtoken';

import { extractJWT, genToken } from '~/utils/jwt';

import { jwtToken } from '../constants';

describe('[Auth Service]: Utils/JWT', () => {
  beforeAll(() => {
    vi.stubEnv('JWT_SECRET', 'test_secret');

    vi.mock('jsonwebtoken', async (importOriginal) => {
      const actual = await importOriginal<typeof import('jsonwebtoken')>();

      return {
        verify: actual.verify,
        JsonWebTokenError: actual.JsonWebTokenError,
        sign: () => {
          return 'jwt-token';
        },
      };
    });
  });

  afterAll(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });

  describe('extractJWT', () => {
    suite('valid token', () => {
      it('returns payload', () => {
        expect(extractJWT(jwtToken)).toEqual({
          sub: 'test@gmail.com',
        });
      });
    });

    suite('invalid token', () => {
      it('returns empty object', () => {
        expect(() => extractJWT('invalid token')).toThrow(JsonWebTokenError);
      });
    });
  });

  describe('genToken', () => {
    it('generates jwt token', () => {
      expect(genToken({ payload: {} })).toEqual('jwt-token');
    });
  });
});
