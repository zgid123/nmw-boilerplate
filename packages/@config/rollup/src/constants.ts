import json from '@rollup/plugin-json';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';

import type { TExtension, TModule } from './interface';

export const commonPlugins = [json(), resolve(), commonjs()];

export const formats: TModule[] = ['cjs', 'es'];

export const extensionMapping: Record<TModule, TExtension> = {
  es: 'mjs',
  cjs: 'cjs',
};
