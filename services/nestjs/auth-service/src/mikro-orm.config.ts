import { config, type TMikroConfig } from '@cjs/mikro/config';

const mikroConfig: TMikroConfig = config({
  allowGlobalContext: true,
});

export default mikroConfig;
