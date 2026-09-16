import { crashReporter } from "@/lib/crash";
import { normalizeError } from "@/lib/errors/error-utils";
import { logger } from "@/lib/logger";

export type LogContext = Record<string, unknown>;

/**
 * Central place to report errors. Always logs locally and, for reportable
 * errors, forwards to the crash reporting provider (no-op until one is set).
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

  logger.error(`[AppError:${appError.code}]`, payload);

  if (appError.reportable) {
    crashReporter.captureException(appError, context);
  }
}
