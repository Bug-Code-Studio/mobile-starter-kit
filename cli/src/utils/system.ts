import { spawn } from 'node:child_process';
import process from 'node:process';

// Runs a command and captures its stdout, returning the trimmed
// first line. Resolves to null when the command is missing or exits
// with a non-zero code.
export function getCommandVersion(
  command: string,
  args: string[] = ['--version'],
): Promise<string | null> {
  return new Promise((resolve) => {
    const child = spawn(command, args, {
      stdio: ['ignore', 'pipe', 'ignore'],
      shell: process.platform === 'win32',
    });

    let output = '';

    child.stdout.on('data', (chunk) => {
      output += chunk.toString();
    });

    child.on('error', () => {
      resolve(null);
    });

    child.on('close', (code) => {
      if (code !== 0) {
        resolve(null);
        return;
      }

      const firstLine = output.trim().split('\n')[0]?.trim();

      resolve(firstLine ? firstLine : null);
    });
  });
}

export async function commandExists(command: string): Promise<boolean> {
  const version = await getCommandVersion(command);

  return version !== null;
}
