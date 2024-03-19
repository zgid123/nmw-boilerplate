import { defineConfig } from 'rollup';
import json from '@rollup/plugin-json';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';

const commonPlugins = [json(), resolve(), commonjs(), typescript()];

export default defineConfig({
  input: 'src/index.ts',
  plugins: commonPlugins,
  external: [
    '@rollup/plugin-commonjs',
    '@rollup/plugin-json',
    '@rollup/plugin-node-resolve',
    '@rollup/plugin-typescript',
    'rollup',
    'rollup-plugin-delete',
  ],
  output: [
    {
      file: './lib/index.cjs',
      format: 'cjs',
    },
    {
      file: './lib/index.mjs',
      format: 'es',
    },
  ],
});
