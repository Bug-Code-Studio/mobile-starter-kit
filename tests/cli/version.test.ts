import { describe, expect, it } from 'vitest';

import { getVersion } from '../../cli/src/utils/version.js';

describe('version', () => {
  it('returns the CLI version from package.json', async () => {
    const version = await getVersion();

    expect(version).toMatch(/^\d+\.\d+\.\d+/);
  });
});
