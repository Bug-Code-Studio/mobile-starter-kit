import {
  afterEach,
  describe,
  expect,
  it,
} from 'vitest';

import {
  detectPackageManager,
  resolvePackageManager,
} from '../../cli/src/utils/package-manager.js';

describe('package manager', () => {
  const originalUserAgent =
    process.env.npm_config_user_agent;

  afterEach(() => {
    if (
      originalUserAgent === undefined
    ) {
      delete process.env.npm_config_user_agent;
    } else {
      process.env.npm_config_user_agent =
        originalUserAgent;
    }
  });

  it('detects yarn', () => {
    process.env.npm_config_user_agent =
      'yarn/4.0.0 npm/? node/v22';

    expect(
      detectPackageManager(),
    ).toBe('yarn');
  });

  it('detects pnpm', () => {
    process.env.npm_config_user_agent =
      'pnpm/10.0.0 npm/? node/v22';

    expect(
      detectPackageManager(),
    ).toBe('pnpm');
  });

  it('detects bun', () => {
    process.env.npm_config_user_agent =
      'bun/1.2.0 npm/? node/v22';

    expect(
      detectPackageManager(),
    ).toBe('bun');
  });

  it('falls back to npm', () => {
    process.env.npm_config_user_agent =
      'npm/11.0.0 node/v22';

    expect(
      detectPackageManager(),
    ).toBe('npm');
  });

  it('uses explicitly selected package manager', () => {
    expect(
      resolvePackageManager('yarn'),
    ).toBe('yarn');

    expect(
      resolvePackageManager('pnpm'),
    ).toBe('pnpm');

    expect(
      resolvePackageManager('bun'),
    ).toBe('bun');

    expect(
      resolvePackageManager('npm'),
    ).toBe('npm');
  });
});