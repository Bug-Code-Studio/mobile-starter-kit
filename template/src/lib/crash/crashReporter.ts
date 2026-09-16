import type {
  CrashBreadcrumb,
  CrashContext,
  CrashReporterProvider,
  CrashSeverity,
  CrashUser,
} from '@/lib/crash/types';

const isDev = typeof __DEV__ !== 'undefined' && __DEV__;

/**
 * Default provider used until a real backend is registered. It logs to the
 * console in development and stays silent in production.
 */
const noopProvider: CrashReporterProvider = {
  captureException(error, context) {
    if (isDev) {
      console.error('[crashReporter] captureException', error, context);
    }
  },
  captureMessage(message, level) {
    if (isDev) {
      console.warn(`[crashReporter] captureMessage (${level ?? 'info'})`, message);
    }
  },
  setUser(user) {
    if (isDev) {
      console.info('[crashReporter] setUser', user);
    }
  },
  addBreadcrumb(breadcrumb) {
    if (isDev) {
      console.debug('[crashReporter] addBreadcrumb', breadcrumb);
    }
  },
};

let provider: CrashReporterProvider = noopProvider;

/**
 * Provider-agnostic crash reporting facade. Register a concrete provider once
 * at app startup with `crashReporter.setProvider(...)`.
 */
export const crashReporter = {
  setProvider(next: CrashReporterProvider): void {
    provider = next;
  },

  captureException(error: unknown, context?: CrashContext): void {
    provider.captureException(error, context);
  },

  captureMessage(message: string, level?: CrashSeverity): void {
    provider.captureMessage(message, level);
  },

  setUser(user: CrashUser | null): void {
    provider.setUser(user);
  },

  addBreadcrumb(breadcrumb: CrashBreadcrumb): void {
    provider.addBreadcrumb(breadcrumb);
  },
} as const;
