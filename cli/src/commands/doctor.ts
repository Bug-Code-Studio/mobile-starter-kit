import path from 'node:path';
import process from 'node:process';

import fs from 'fs-extra';

import { getCommandVersion } from '../utils/system.js';

import { blank, divider, error, heading, info } from '../utils/logger.js';

import { bold, dim, green, red, yellow } from '../utils/colors.js';

export const MIN_NODE_MAJOR = 20;

export type CheckStatus = 'pass' | 'warn' | 'fail';

export type CheckResult = {
  name: string;
  status: CheckStatus;
  detail: string;
};

export function parseMajorVersion(version: string): number | null {
  const match = version.match(/(\d+)\.\d+\.\d+/);

  if (!match) {
    return null;
  }

  return Number.parseInt(match[1], 10);
}

// Reduces raw check results into an actionable summary.
export function evaluateChecks(results: CheckResult[]): {
  failures: CheckResult[];
  warnings: CheckResult[];
  ok: boolean;
} {
  const failures = results.filter((result) => result.status === 'fail');
  const warnings = results.filter((result) => result.status === 'warn');

  return {
    failures,
    warnings,
    ok: failures.length === 0,
  };
}

function checkNode(): CheckResult {
  const version = process.versions.node;
  const major = parseMajorVersion(version);

  if (major === null || major < MIN_NODE_MAJOR) {
    return {
      name: 'Node.js',
      status: 'fail',
      detail: `v${version} (requires >= ${MIN_NODE_MAJOR})`,
    };
  }

  return {
    name: 'Node.js',
    status: 'pass',
    detail: `v${version}`,
  };
}

async function checkPackageManagers(): Promise<CheckResult[]> {
  const managers = ['npm', 'yarn', 'pnpm', 'bun'] as const;

  const versions = await Promise.all(
    managers.map((manager) => getCommandVersion(manager)),
  );

  const results: CheckResult[] = managers.map((manager, index) => {
    const version = versions[index];

    return {
      name: manager,
      status: version ? 'pass' : 'warn',
      detail: version ? `v${version.replace(/^v/, '')}` : 'not found',
    };
  });

  const hasAny = results.some((result) => result.status === 'pass');

  if (!hasAny) {
    // At least one package manager is required.
    results.push({
      name: 'package manager',
      status: 'fail',
      detail: 'none of npm/yarn/pnpm/bun were found',
    });
  }

  return results;
}

async function checkGit(): Promise<CheckResult> {
  const version = await getCommandVersion('git');

  if (!version) {
    return {
      name: 'Git',
      status: 'fail',
      detail: 'not found',
    };
  }

  return {
    name: 'Git',
    status: 'pass',
    detail: version.replace(/^git version\s*/, 'v'),
  };
}

async function checkWatchman(): Promise<CheckResult> {
  const version = await getCommandVersion('watchman');

  if (!version) {
    return {
      name: 'Watchman',
      status: 'warn',
      detail: 'not found (recommended for React Native)',
    };
  }

  return {
    name: 'Watchman',
    status: 'pass',
    detail: `v${version.replace(/^v/, '')}`,
  };
}

async function isExpoProject(cwd: string): Promise<boolean> {
  const packageJsonPath = path.join(cwd, 'package.json');

  if (!(await fs.pathExists(packageJsonPath))) {
    return false;
  }

  try {
    const packageJson = await fs.readJson(packageJsonPath);

    return Boolean(
      packageJson.dependencies?.expo || packageJson.devDependencies?.expo,
    );
  } catch {
    return false;
  }
}

function symbolFor(status: CheckStatus): string {
  switch (status) {
    case 'pass':
      return green('✔');
    case 'warn':
      return yellow('⚠');
    case 'fail':
      return red('✖');
  }
}

function printResult(result: CheckResult): void {
  const label = result.name.padEnd(18);

  console.log(`  ${symbolFor(result.status)} ${label} ${dim(result.detail)}`);
}

export async function runDoctor(): Promise<void> {
  heading('Running environment checks');
  blank();

  const results: CheckResult[] = [];

  results.push(checkNode());
  results.push(...(await checkPackageManagers()));
  results.push(await checkGit());
  results.push(await checkWatchman());

  for (const result of results) {
    printResult(result);
  }

  const { failures, warnings, ok } = evaluateChecks(results);

  const cwd = process.env.INIT_CWD ?? process.cwd();

  if (await isExpoProject(cwd)) {
    divider();

    info('Expo project detected — running expo-doctor');
    blank();

    await runExpoDoctor(cwd);
  }

  divider();

  if (ok && warnings.length === 0) {
    console.log(green(bold('All checks passed. Your environment is ready.')));
    return;
  }

  if (ok) {
    console.log(
      yellow(
        `Environment is usable with ${warnings.length} warning(s) above.`,
      ),
    );
    return;
  }

  error(
    `${failures.length} required check(s) failed. Please resolve them before continuing.`,
  );

  process.exitCode = 1;
}

function runExpoDoctor(cwd: string): Promise<void> {
  return new Promise((resolve) => {
    // Lazily imported to avoid a hard dependency for the common path.
    import('node:child_process').then(({ spawn }) => {
      const child = spawn('npx', ['expo-doctor'], {
        cwd,
        stdio: 'inherit',
        shell: process.platform === 'win32',
      });

      child.on('error', () => {
        error('Could not run "npx expo-doctor".');
        resolve();
      });

      child.on('close', () => {
        resolve();
      });
    });
  });
}
