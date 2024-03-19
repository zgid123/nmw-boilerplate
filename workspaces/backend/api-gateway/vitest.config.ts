import { configVitest } from '@nest/test-utils/vitest';

import type { UserConfigExport } from 'vitest/config';

export default function config(): UserConfigExport {
  return configVitest({
    root: __dirname,
  });
}
