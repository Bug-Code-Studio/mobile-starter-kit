import process from 'node:process';

const ANSI = {
  reset: '\u001b[0m',
  bold: '\u001b[1m',
  dim: '\u001b[2m',
  red: '\u001b[31m',
  green: '\u001b[32m',
  yellow: '\u001b[33m',
  blue: '\u001b[34m',
  cyan: '\u001b[36m',
  gray: '\u001b[90m',
} as const;

type Color = keyof Omit<typeof ANSI, 'reset'>;

// Honors NO_COLOR, FORCE_COLOR and TTY detection.
export function useColor(): boolean {
  if (process.env.NO_COLOR) {
    return false;
  }

  if (process.env.FORCE_COLOR) {
    return true;
  }

  return Boolean(process.stdout && process.stdout.isTTY);
}

export function colorize(color: Color, message: string): string {
  if (!useColor()) {
    return message;
  }

  return `${ANSI[color]}${message}${ANSI.reset}`;
}

export const red = (message: string) => colorize('red', message);
export const green = (message: string) => colorize('green', message);
export const yellow = (message: string) => colorize('yellow', message);
export const blue = (message: string) => colorize('blue', message);
export const cyan = (message: string) => colorize('cyan', message);
export const gray = (message: string) => colorize('gray', message);
export const dim = (message: string) => colorize('dim', message);
export const bold = (message: string) => colorize('bold', message);
