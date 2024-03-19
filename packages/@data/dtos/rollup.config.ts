import { config } from '@config/rollup';

export default config(
  [
    {
      input: 'src/schemas/index.ts',
    },
    {
      input: 'src/zod.ts',
    },
    {
      input: 'src/nestjs.ts',
    },
  ],
  {
    external: ['@anatine/zod-nestjs', 'zod'],
  },
);
