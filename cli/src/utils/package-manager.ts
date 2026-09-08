import type { PackageManager } from '../types/project.js';

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
  selectedPackageManager: PackageManager | null,
): PackageManager {
  return (
    selectedPackageManager ??
    detectPackageManager()
  );
}