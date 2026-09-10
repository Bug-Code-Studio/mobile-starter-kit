import { normalizeError } from "@/lib/errors/error-utils";

export type LogContext = Record<string, unknown>;

/**
 * Central place to report errors. In development it logs to the console;
 * in production wire this up to a monitoring service (Sentry, Bugsnag, etc.).
 */
export function logError(error: unknown, context?: LogContext): void {
  const appError = normalizeError(error);

  const payload = {
    code: appError.code,
    message: appError.message,
    messageKey: appError.messageKey,
    severity: appError.severity,
    retryable: appError.retryable,
    ...(context ? { context } : {}),
    cause: appError.cause,
  };

  if (typeof __DEV__ !== "undefined" && __DEV__) {
    console.error("[AppError]", payload);
    return;
  }

  // TODO: forward `payload` to your monitoring provider.
  console.error(`[AppError:${appError.code}]`, appError.message);
}
