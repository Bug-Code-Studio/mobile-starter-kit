export type CrashSeverity = 'info' | 'warning' | 'error' | 'fatal';

export type CrashContext = Record<string, unknown>;

export type CrashUser = {
  id: string;
  email?: string;
  username?: string;
};

export type CrashBreadcrumb = {
  message: string;
  category?: string;
  level?: CrashSeverity;
  data?: Record<string, unknown>;
};

/**
 * Provider-agnostic crash reporting contract. Implement this to plug in a
 * concrete backend (Sentry, Bugsnag, Firebase Crashlytics, etc.).
 */
export type CrashReporterProvider = {
  captureException(error: unknown, context?: CrashContext): void;
  captureMessage(message: string, level?: CrashSeverity): void;
  setUser(user: CrashUser | null): void;
  addBreadcrumb(breadcrumb: CrashBreadcrumb): void;
};
