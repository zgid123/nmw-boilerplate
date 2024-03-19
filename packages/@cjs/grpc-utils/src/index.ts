import { readFile } from 'fs';
import { resolve } from 'path';
import { promisify } from 'node:util';

import type { IServerProps } from '@grpc.ts/core';

export function loadProto(name: string): string {
  return resolve(__dirname, `../../../../_protos/${name}.proto`);
}

const readFileAsync = promisify(readFile);

interface ILoadCredentialFilesReturnProps {
  pfx: Buffer;
  crt: Buffer;
  pem: Buffer;
  cnf: Buffer;
}

export async function loadCredentialFiles(): Promise<ILoadCredentialFilesReturnProps> {
  const [pfx, crt, pem, cnf] = await Promise.all([
    readFileAsync(resolve(__dirname, '../../../../infrastructure/tls/tls.crt')),
    readFileAsync(resolve(__dirname, '../../../../infrastructure/tls/tls.pem')),
    readFileAsync(resolve(__dirname, '../../../../infrastructure/tls/tls.pfx')),
    readFileAsync(resolve(__dirname, '../../../../infrastructure/tls/tls.cnf')),
  ]);

  return {
    pfx,
    crt,
    pem,
    cnf,
  };
}

export const packageDefinitionOptions: IServerProps['packageDefinitionOptions'] =
  {
    oneofs: true,
    longs: String,
    enums: String,
    defaults: true,
  };

export const options: IServerProps['options'] = {
  keepaliveTimeMs: 5_000,
};

export const grpcOptions: Pick<
  IServerProps,
  'options' | 'packageDefinitionOptions'
> = {
  options,
  packageDefinitionOptions,
};
