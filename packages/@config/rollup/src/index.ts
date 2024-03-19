import delFiles from 'rollup-plugin-delete';
import {
  defineConfig,
  type Plugin,
  type OutputOptions,
  type RollupOptions,
} from 'rollup';

import { commonPlugins } from './constants';
import { buildExternal, buildOutputs, buildTs } from './utils';

import type { TModule } from './interface';

export const del = delFiles;

interface IConfigDataProps
  extends Omit<RollupOptions, 'plugins' | 'input' | 'external'> {
  input: string;
  only?: TModule[];
  plugins?: Plugin[];
  banner?: OutputOptions['banner'];
  external?: Partial<Record<TModule, string[]>> | string[];
}

interface IConfigOptionsProps {
  only?: TModule[];
  rootFolder?: string;
  external?: string[];
  buildFolder?: string;
}

export function config(
  data: IConfigDataProps | IConfigDataProps[],
  options: IConfigOptionsProps = {},
): RollupOptions[] {
  if (!Array.isArray(data)) {
    data = [data];
  }

  const {
    rootFolder = 'src',
    buildFolder = 'lib',
    external: commonExternal = [],
    only: commonOnly = ['cjs', 'es'],
  } = options;

  const configs = data.reduce<RollupOptions[]>((result, datumn) => {
    const {
      input,
      banner,
      output,
      only = [],
      plugins = [],
      external = [],
      ...rest
    } = datumn;

    const plugs = [...commonPlugins, ...plugins];
    const externalDict = buildExternal({ external });

    const outputs = buildOutputs({
      input,
      output,
      banner,
      rootFolder,
      buildFolder,
      only: [...commonOnly, ...only],
    });

    outputs.forEach((output) => {
      const { ext, ...outputRest } = output;

      result.push(
        defineConfig({
          ...rest,
          input,
          output: outputRest,
          external: [...commonExternal, ...(externalDict[ext] || [])],
          plugins: [
            ...plugs,
            buildTs({
              input,
              rootFolder,
            }),
          ],
        }),
      );
    });

    return result;
  }, []);

  return configs;
}
