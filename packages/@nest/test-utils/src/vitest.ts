import { resolve } from 'path';
import swc from 'unplugin-swc';
import { defineConfig, type UserConfigExport } from 'vitest/config';

import type { InlineConfig } from 'vitest';

interface IConfigVitestParams {
  root: string;
  server?: InlineConfig['server'];
}

export function configVitest({
  root,
  server,
}: IConfigVitestParams): UserConfigExport {
  return defineConfig({
    test: {
      server,
      root: './src',
      globals: true,
      include: ['**/*.spec.ts'],
      coverage: {
        provider: 'istanbul',
        reporter: ['text', 'json', 'html'],
        exclude: [
          'main.ts',
          '**/*.module.ts',
          '**/*.profile.ts',
          '**/db/migrations',
          '**/mikro-orm.config.ts',
        ],
      },
    },
    resolve: {
      alias: [
        {
          find: '~',
          replacement: resolve(root, 'src'),
        },
      ],
    },
    plugins: [
      swc.vite({
        swcrc: false,
        module: {
          type: 'es6',
        },
      }),
    ],
  });
}
