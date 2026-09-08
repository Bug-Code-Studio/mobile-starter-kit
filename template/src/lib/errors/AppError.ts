import type { ErrorCode } from '@/lib/errors/error-codes';

export class AppError extends Error {
  readonly code: ErrorCode;
  readonly userMessage: string;
  readonly cause?: unknown;

  constructor(
    message: string,
    options?: {
      code?: ErrorCode;
      userMessage?: string;
      cause?: unknown;
    },
  ) {
    super(message);

    this.name = 'AppError';
    this.code = options?.code ?? 'UNKNOWN_ERROR';
    this.userMessage =
      options?.userMessage ??
      'Something went wrong. Please try again.';
    this.cause = options?.cause;

    Object.setPrototypeOf(this, AppError.prototype);
  }
}