import { config } from '@config/rollup';

const external = ['date-fns'];

export default config(
  [
    {
      input: 'src/dateUtils.ts',
    },
    {
      input: 'src/stringUtils.ts',
    },
  ],
  {
    external,
  },
);
