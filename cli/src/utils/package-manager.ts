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

export function getPackageManagerFromArgs(
  args: string[],
): PackageManager | null {
  for (const arg of args) {
    const packageManager =
      PACKAGE_MANAGER_FLAGS[arg];

    if (packageManager) {
      return packageManager;
    }
  }

  return null;
}

export function detectPackageManager(): PackageManager {
  const userAgent =
    process.env.npm_config_user_agent ?? '';

  if (userAgent.includes('yarn/')) {
    return 'yarn';
  }

  if (userAgent.includes('pnpm/')) {
    return 'pnpm';
  }

  if (userAgent.includes('bun/')) {
    return 'bun';
  }

  return 'npm';
}

export function resolvePackageManager(
  args: string[],
): PackageManager {
  return (
    getPackageManagerFromArgs(args) ??
    detectPackageManager()
  );
}