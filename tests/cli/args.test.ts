import { describe, expect, it } from 'vitest';

import { parseArgs } from '../../cli/src/utils/args.js';

describe('args', () => {
  it('parses app name', () => {
    expect(
      parseArgs(['MyApp']),
    ).toEqual({
      appName: 'MyApp',
      packageManager: null,
      noInstall: false,
      noGit: false,
    });
  });

  it('supports flags before app name', () => {
    expect(
      parseArgs([
        '--yarn',
        'MyApp',
      ]),
    ).toEqual({
      appName: 'MyApp',
      packageManager: 'yarn',
      noInstall: false,
      noGit: false,
    });
  });

  it('supports flags after app name', () => {
    expect(
      parseArgs([
        'MyApp',
        '--yarn',
      ]),
    ).toEqual({
      appName: 'MyApp',
      packageManager: 'yarn',
      noInstall: false,
      noGit: false,
    });
  });

  it('parses multiple flags', () => {
    expect(
      parseArgs([
        '--pnpm',
        '--no-install',
        '--no-git',
        'MyApp',
      ]),
    ).toEqual({
      appName: 'MyApp',
      packageManager: 'pnpm',
      noInstall: true,
      noGit: true,
    });
  });

  it('returns undefined when app name is missing', () => {
    expect(
      parseArgs([]),
    ).toEqual({
      appName: undefined,
      packageManager: null,
      noInstall: false,
      noGit: false,
    });
  });

  it('rejects multiple positional arguments', () => {
    expect(() =>
      parseArgs([
        'MyApp',
        'AnotherApp',
      ]),
    ).toThrow(
      'Unexpected argument: AnotherApp',
    );
  });
});