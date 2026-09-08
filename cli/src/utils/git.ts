import { spawn } from 'node:child_process';

function runGitCommand(
  args: string[],
  cwd: string,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn(
      'git',
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
          `git ${args.join(' ')} failed with exit code ${code}.`,
        ),
      );
    });
  });
}

export async function initializeGit(
  cwd: string,
): Promise<void> {
  await runGitCommand(
    ['init'],
    cwd,
  );

  await runGitCommand(
    ['add', '.'],
    cwd,
  );

  await runGitCommand(
    [
      'commit',
      '-m',
      'chore: initialize project',
    ],
    cwd,
  );
}