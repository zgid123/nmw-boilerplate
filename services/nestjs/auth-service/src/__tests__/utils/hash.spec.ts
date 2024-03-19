import { bcryptHash, generateSalt } from '~/utils/hash';

describe('[Auth Service]: Utils/Hash', () => {
  beforeAll(() => {
    vi.mock('bcrypt', () => {
      return {
        genSalt: async (characterNumber: number) => {
          return characterNumber === 10 ? 'test-salt' : 'test-12-salt';
        },
        hashSync: (_source: TAny, salt: string) => {
          return `hash-${salt}`;
        },
      };
    });
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  describe('generateSalt', () => {
    suite('default character number', () => {
      it('generates 10 characters', async () => {
        expect(await generateSalt()).toEqual('test-salt');
      });
    });

    suite('pass character number by 12', () => {
      it('generates characters', async () => {
        expect(await generateSalt(12)).toEqual('test-12-salt');
      });
    });
  });

  describe('bcryptHash', () => {
    suite('default salt', () => {
      it('generates salt and hash', async () => {
        expect(await bcryptHash({ source: 'test' })).toEqual({
          salt: 'test-salt',
          hash: 'hash-test-salt',
        });
      });
    });

    suite('pass salt', () => {
      it('generates salt and hash', async () => {
        expect(await bcryptHash({ source: 'test', salt: '1234' })).toEqual({
          salt: '1234',
          hash: 'hash-1234',
        });
      });
    });
  });
});
