export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const isDev = typeof __DEV__ !== 'undefined' && __DEV__;

/**
 * Lightweight app logger. In development every level prints to the console;
 * in production `debug`/`info` are silenced while `warn`/`error` are kept so
 * they remain visible to native log collectors.
 */
export const logger = {
  debug(message: string, ...args: unknown[]): void {
    if (isDev) {
      console.debug(`[debug] ${message}`, ...args);
    }
  },

  info(message: string, ...args: unknown[]): void {
    if (isDev) {
      console.info(`[info] ${message}`, ...args);
    }
  },

  warn(message: string, ...args: unknown[]): void {
    console.warn(`[warn] ${message}`, ...args);
  },

  error(message: string, ...args: unknown[]): void {
    console.error(`[error] ${message}`, ...args);
  },
} as const;
