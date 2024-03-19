import type { IConfigProps } from '@grpc.ts/cli';

const config: IConfigProps = {
  paths: './_protos/**/*.proto',
  output: './packages/@data/grpc/src',
};

export default config;
