import { ERROR_CODES, type ErrorCode } from '@/lib/errors/error-codes';

export type ErrorSeverity = 'info' | 'warning' | 'error' | 'fatal';

export type AppErrorParams = Record<string, string | number>;

export type AppErrorOptions = {
  code?: ErrorCode;
  messageKey?: string;
  params?: AppErrorParams;
  retryable?: boolean;
  reportable?: boolean;
  severity?: ErrorSeverity;
  cause?: unknown;
};

export class AppError extends Error {
  readonly code: ErrorCode;
  readonly messageKey: string;
  readonly params?: AppErrorParams;
  readonly retryable: boolean;
  readonly reportable: boolean;
  readonly severity: ErrorSeverity;
  readonly cause?: unknown;

  constructor(message: string, options?: AppErrorOptions) {
    super(message);

    this.name = 'AppError';
    this.code = options?.code ?? ERROR_CODES.UNKNOWN;
    this.messageKey = options?.messageKey ?? 'errors.unknown';
    this.params = options?.params;
    this.retryable = options?.retryable ?? false;
    this.reportable = options?.reportable ?? true;
    this.severity = options?.severity ?? 'error';
    this.cause = options?.cause;

    Object.setPrototypeOf(this, AppError.prototype);
  }
}