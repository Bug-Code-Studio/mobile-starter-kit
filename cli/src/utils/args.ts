import type { PackageManager } from '../types/project.js';

import { parseFlags } from './flags.js';

export type ParsedArgs = {
  appName: string | undefined;
  packageManager: PackageManager | null;
  noInstall: boolean;
  noGit: boolean;
};

export function parseArgs(
  args: string[],
): ParsedArgs {
  const positionalArgs = args.filter(
    (arg) => !arg.startsWith('--'),
  );

  if (positionalArgs.length > 1) {
    throw new Error(
      `Unexpected argument: ${positionalArgs[1]}`,
    );
  }

  const flags = parseFlags(args);

  return {
    appName: positionalArgs[0],
    packageManager: flags.packageManager,
    noInstall: flags.noInstall,
    noGit: flags.noGit,
  };
}