import { config } from '@config/rollup';

const external = [
  '@mikro-orm/core',
  '@mikro-orm/entity-generator',
  '@mikro-orm/migrations',
  '@mikro-orm/postgresql',
  '@mikro-orm/seeder',
  'pluralize',
  'uniqid',
];

export default config(
  [
    {
      input: 'src/config/index.ts',
    },
    {
      input: 'src/core.ts',
    },
  ],
  {
    external,
    only: ['cjs'],
  },
);
