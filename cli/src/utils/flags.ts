import type { PackageManager } from '../types/project.js';

const PACKAGE_MANAGER_FLAGS: Record<
  string,
  PackageManager
> = {
  '--npm': 'npm',
  '--yarn': 'yarn',
  '--pnpm': 'pnpm',
  '--bun': 'bun',
};

const SUPPORTED_FLAGS = new Set([
  '--no-install',
  '--no-git',
  '--npm',
  '--yarn',
  '--pnpm',
  '--bun',
]);

export type CliOptions = {
  packageManager: PackageManager | null;
  noInstall: boolean;
  noGit: boolean;
};

export function parseFlags(
  args: string[],
): CliOptions {
  const packageManagerFlags = args.filter(
    (arg) => PACKAGE_MANAGER_FLAGS[arg],
  );

  if (packageManagerFlags.length > 1) {
    throw new Error(
      `Only one package manager can be selected: ${packageManagerFlags.join(
        ', ',
      )}`,
    );
  }

  for (const arg of args) {
    if (
      arg.startsWith('--') &&
      !SUPPORTED_FLAGS.has(arg)
    ) {
      throw new Error(
        `Unknown option: ${arg}`,
      );
    }
  }

  return {
    packageManager:
      packageManagerFlags.length === 1
        ? PACKAGE_MANAGER_FLAGS[
            packageManagerFlags[0]
          ]
        : null,

    noInstall: args.includes(
      '--no-install',
    ),

    noGit: args.includes('--no-git'),
  };
}