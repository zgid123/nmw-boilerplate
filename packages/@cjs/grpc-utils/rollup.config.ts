import { config } from '@config/rollup';

export default config(
  {
    input: 'src/index.ts',
  },
  {
    only: ['cjs'],
  },
);
