import typescript from '@rollup/plugin-typescript';

import type { OutputOptions, Plugin } from 'rollup';

import { extensionMapping, formats } from './constants';

import type { TExternal, TExternalDict, TModule } from './interface';

interface IBuildOutputsParams {
  input: string;
  only: TModule[];
  rootFolder: string;
  buildFolder: string;
  banner?: OutputOptions['banner'];
  output: OutputOptions | OutputOptions[] | undefined;
}

interface IBuildOutputReturnProps extends OutputOptions {
  ext: TModule;
}

function extractFileName(input: string): string {
  const parts = input.split('.');
  parts.pop();

  return parts.join('.');
}

export function buildOutputs({
  only,
  input,
  output,
  banner,
  rootFolder,
  buildFolder,
}: IBuildOutputsParams): IBuildOutputReturnProps[] {
  const supportedExtensions = formats.filter((f) => only.includes(f));
  const nonExtInput = extractFileName(input);
  const path = nonExtInput.replace(rootFolder, buildFolder);

  if (!output) {
    return supportedExtensions.map((supportedExtension) => {
      return {
        banner,
        ext: supportedExtension,
        format: supportedExtension,
        file: [path, extensionMapping[supportedExtension]].join('.'),
      };
    });
  }

  if (!Array.isArray(output)) {
    output = [output];
  }

  return output.reduce<IBuildOutputReturnProps[]>((result, o) => {
    const { file, banner: configBanner, ...rest } = o;

    supportedExtensions.forEach((supportedExtension) => {
      result.push({
        ...rest,
        ext: supportedExtension,
        format: supportedExtension,
        banner: configBanner || banner,
        file: file || [path, extensionMapping[supportedExtension]].join('.'),
      });
    });

    return result;
  }, []);
}

interface IBuildExternalParams {
  external: TExternal;
}

export function buildExternal({
  external,
}: IBuildExternalParams): TExternalDict {
  if (!Array.isArray(external)) {
    return external;
  }

  return {
    es: external,
    cjs: external,
  };
}

interface IBuildTsParams {
  input: string;
  rootFolder: string;
}

export function buildTs({ input, rootFolder }: IBuildTsParams): Plugin {
  const folderPath = input.replace(`${rootFolder}/`, '');
  let path = input;

  if (folderPath.includes('/')) {
    const factors = folderPath.split('/');
    factors.pop();
    path = `src/${factors.join('/')}/**/*.ts|tsx`;
  }

  return typescript({
    include: [path],
  });
}
