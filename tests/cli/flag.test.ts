import { describe, expect, it } from 'vitest';

import { parseFlags } from '../../cli/src/utils/flags.js';

describe('flags', () => {
  it('parses npm flag', () => {
    expect(
      parseFlags(['MyApp', '--npm']),
    ).toEqual({
      packageManager: 'npm',
      noInstall: false,
      noGit: false,
    });
  });

  it('parses yarn flag', () => {
    expect(
      parseFlags(['MyApp', '--yarn']),
    ).toEqual({
      packageManager: 'yarn',
      noInstall: false,
      noGit: false,
    });
  });

  it('parses pnpm flag', () => {
    expect(
      parseFlags(['MyApp', '--pnpm']),
    ).toEqual({
      packageManager: 'pnpm',
      noInstall: false,
      noGit: false,
    });
  });

  it('parses bun flag', () => {
    expect(
      parseFlags(['MyApp', '--bun']),
    ).toEqual({
      packageManager: 'bun',
      noInstall: false,
      noGit: false,
    });
  });

  it('parses no-install flag', () => {
    expect(
      parseFlags([
        'MyApp',
        '--no-install',
      ]),
    ).toEqual({
      packageManager: null,
      noInstall: true,
      noGit: false,
    });
  });

  it('parses no-git flag', () => {
    expect(
      parseFlags([
        'MyApp',
        '--no-git',
      ]),
    ).toEqual({
      packageManager: null,
      noInstall: false,
      noGit: true,
    });
  });

  it('parses multiple valid flags', () => {
    expect(
      parseFlags([
        'MyApp',
        '--yarn',
        '--no-install',
        '--no-git',
      ]),
    ).toEqual({
      packageManager: 'yarn',
      noInstall: true,
      noGit: true,
    });
  });

  it('rejects multiple package managers', () => {
    expect(() =>
      parseFlags([
        'MyApp',
        '--npm',
        '--yarn',
      ]),
    ).toThrow(
      'Only one package manager can be selected: --npm, --yarn',
    );
  });

  it('rejects unknown flags', () => {
    expect(() =>
      parseFlags([
        'MyApp',
        '--foobar',
      ]),
    ).toThrow(
      'Unknown option: --foobar',
    );
  });
});