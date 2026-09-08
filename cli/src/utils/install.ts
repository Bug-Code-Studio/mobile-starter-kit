import fs from 'fs-extra';
import path from 'node:path';
import { spawn } from 'node:child_process';

import type { PackageManager } from '../types/project.js';

function getInstallCommand(
  packageManager: PackageManager,
) {
  switch (packageManager) {
    case 'npm':
      return {
        command: 'npm',
        args: ['install'],
      };

    case 'yarn':
      return {
        command: 'yarn',
        args: ['install'],
      };

    case 'pnpm':
      return {
        command: 'pnpm',
        args: ['install'],
      };

    case 'bun':
      return {
        command: 'bun',
        args: ['install'],
      };
  }
}

async function prepareProjectForInstall(
  packageManager: PackageManager,
  cwd: string,
) {
  if (packageManager !== 'yarn') {
    return;
  }

  const yarnLockPath = path.join(
    cwd,
    'yarn.lock',
  );

  if (!(await fs.pathExists(yarnLockPath))) {
    await fs.writeFile(
      yarnLockPath,
      '',
      'utf8',
    );
  }
}

export async function installDependencies(
  packageManager: PackageManager,
  cwd: string,
): Promise<void> {
  await prepareProjectForInstall(
    packageManager,
    cwd,
  );

  const {
    command,
    args,
  } = getInstallCommand(packageManager);

  return new Promise((resolve, reject) => {
    const child = spawn(
      command,
      args,
      {
        cwd,
        stdio: 'inherit',
        shell: process.platform === 'win32',
      },
    );

    child.on('error', (error) => {
      reject(error);
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(
        new Error(
          `${packageManager} install failed with exit code ${code}.`,
        ),
      );
    });
  });
}