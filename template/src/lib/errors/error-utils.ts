import { AppError } from "./AppError";
import { ERROR_CODES, type ErrorCode } from "./error-codes";
import { ERROR_MESSAGE_KEYS } from "./error-messages";

type SupabaseErrorLike = {
  message?: string;
  code?: string;
  status?: number;
};

type ErrorClassification = {
  code: ErrorCode;
  retryable: boolean;
  reportable: boolean;
};

const SUPABASE_ERROR_MAP: Record<string, ErrorClassification> = {
  invalid_credentials: {
    code: ERROR_CODES.AUTH_INVALID_CREDENTIALS,
    retryable: false,
    reportable: false,
  },

  email_not_confirmed: {
    code: ERROR_CODES.AUTH_EMAIL_NOT_CONFIRMED,
    retryable: false,
    reportable: false,
  },

  user_already_exists: {
    code: ERROR_CODES.AUTH_USER_ALREADY_EXISTS,
    retryable: false,
    reportable: false,
  },

  otp_expired: {
    code: ERROR_CODES.AUTH_OTP_EXPIRED,
    retryable: false,
    reportable: false,
  },

  invalid_otp: {
    code: ERROR_CODES.AUTH_INVALID_OTP,
    retryable: false,
    reportable: false,
  },

  email_exists: {
    code: ERROR_CODES.AUTH_USER_ALREADY_EXISTS,
    retryable: false,
    reportable: false,
  },

  weak_password: {
    code: ERROR_CODES.AUTH_WEAK_PASSWORD,
    retryable: false,
    reportable: false,
  },

  same_password: {
    code: ERROR_CODES.AUTH_SAME_PASSWORD,
    retryable: false,
    reportable: false,
  },

  signup_disabled: {
    code: ERROR_CODES.AUTH_SIGNUP_DISABLED,
    retryable: false,
    reportable: false,
  },

  session_not_found: {
    code: ERROR_CODES.AUTH_SESSION_EXPIRED,
    retryable: false,
    reportable: false,
  },

  over_request_rate_limit: {
    code: ERROR_CODES.RATE_LIMITED,
    retryable: true,
    reportable: true,
  },

  over_email_send_rate_limit: {
    code: ERROR_CODES.RATE_LIMITED,
    retryable: true,
    reportable: true,
  },
};

// Fallback matches for Supabase errors that arrive without a machine-readable `code`.
const SUPABASE_MESSAGE_MAP: Array<{ match: string } & ErrorClassification> = [
  {
    match: "invalid login credentials",
    code: ERROR_CODES.AUTH_INVALID_CREDENTIALS,
    retryable: false,
    reportable: false,
  },
  {
    match: "email not confirmed",
    code: ERROR_CODES.AUTH_EMAIL_NOT_CONFIRMED,
    retryable: false,
    reportable: false,
  },
  {
    match: "already registered",
    code: ERROR_CODES.AUTH_USER_ALREADY_EXISTS,
    retryable: false,
    reportable: false,
  },
  {
    match: "already been confirmed",
    code: ERROR_CODES.AUTH_EMAIL_ALREADY_VERIFIED,
    retryable: false,
    reportable: false,
  },
  {
    match: "already confirmed",
    code: ERROR_CODES.AUTH_EMAIL_ALREADY_VERIFIED,
    retryable: false,
    reportable: false,
  },
  {
    match: "otp has expired",
    code: ERROR_CODES.AUTH_OTP_EXPIRED,
    retryable: false,
    reportable: false,
  },
  {
    match: "expired or is invalid",
    code: ERROR_CODES.AUTH_INVALID_OTP,
    retryable: false,
    reportable: false,
  },
  {
    match: "new password should be different",
    code: ERROR_CODES.AUTH_SAME_PASSWORD,
    retryable: false,
    reportable: false,
  },
  {
    match: "password should be at least",
    code: ERROR_CODES.AUTH_WEAK_PASSWORD,
    retryable: false,
    reportable: false,
  },
  {
    match: "weak password",
    code: ERROR_CODES.AUTH_WEAK_PASSWORD,
    retryable: false,
    reportable: false,
  },
  {
    match: "signups not allowed",
    code: ERROR_CODES.AUTH_SIGNUP_DISABLED,
    retryable: false,
    reportable: false,
  },
];

// Substrings that reliably indicate a connectivity failure across platforms.
const NETWORK_ERROR_HINTS = [
  "network request failed",
  "network error",
  "fetch failed",
  "failed to fetch",
  "connection was lost",
  "connection lost",
  "connection appears to be offline",
  "econnreset",
  "econnrefused",
  "enotfound",
];

const TIMEOUT_ERROR_HINTS = ["timeout", "timed out", "etimedout", "aborted"];

export function normalizeError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error;
  }

  const message = getErrorMessage(error);

  if (matchesHint(message, TIMEOUT_ERROR_HINTS)) {
    return buildError(ERROR_CODES.TIMEOUT, error, message, true, true);
  }

  if (matchesHint(message, NETWORK_ERROR_HINTS)) {
    return buildError(ERROR_CODES.NETWORK, error, message, true, true);
  }

  if (isSupabaseError(error)) {
    const mapped =
      typeof error.code === "string"
        ? SUPABASE_ERROR_MAP[error.code]
        : undefined;

    if (mapped) {
      return buildError(
        mapped.code,
        error,
        error.message,
        mapped.retryable,
        mapped.reportable,
      );
    }
  }

  const byMessage = matchMessageMap(message);

  if (byMessage) {
    return buildError(
      byMessage.code,
      error,
      message,
      byMessage.retryable,
      byMessage.reportable,
    );
  }

  if (isSupabaseError(error)) {
    const byStatus = classifyByStatus(error.status);

    if (byStatus) {
      return buildError(
        byStatus.code,
        error,
        error.message,
        byStatus.retryable,
        byStatus.reportable,
      );
    }
  }

  return buildError(ERROR_CODES.UNKNOWN, error, message, false, true);
}

export function getUserErrorKey(error: unknown): string {
  return normalizeError(error).messageKey;
}

export function resolveUserError(error: unknown): {
  key: string;
  params?: Record<string, string | number>;
  retryable: boolean;
} {
  const appError = normalizeError(error);

  return {
    key: appError.messageKey,
    params: appError.params,
    retryable: appError.retryable,
  };
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

function buildError(
  code: ErrorCode,
  cause: unknown,
  message: string | undefined,
  retryable: boolean,
  reportable: boolean,
): AppError {
  return new AppError(message ?? ERROR_MESSAGE_KEYS[code], {
    code,
    messageKey: ERROR_MESSAGE_KEYS[code],
    retryable,
    reportable,
    cause,
  });
}

function classifyByStatus(status?: number): ErrorClassification | undefined {
  if (!status) {
    return undefined;
  }

  if (status === 401) {
    return { code: ERROR_CODES.UNAUTHORIZED, retryable: false, reportable: false };
  }

  if (status === 403) {
    return { code: ERROR_CODES.FORBIDDEN, retryable: false, reportable: false };
  }

  if (status === 404) {
    return { code: ERROR_CODES.NOT_FOUND, retryable: false, reportable: false };
  }

  if (status === 408) {
    return { code: ERROR_CODES.TIMEOUT, retryable: true, reportable: true };
  }

  if (status === 429) {
    return { code: ERROR_CODES.RATE_LIMITED, retryable: true, reportable: true };
  }

  if (status >= 500) {
    return { code: ERROR_CODES.DATABASE, retryable: true, reportable: true };
  }

  if (status >= 400) {
    return { code: ERROR_CODES.API, retryable: false, reportable: false };
  }

  return undefined;
}

function isSupabaseError(error: unknown): error is SupabaseErrorLike {
  if (typeof error !== "object" || error === null) {
    return false;
  }

  const value = error as Record<string, unknown>;

  return typeof value.code === "string" || typeof value.status === "number";
}

function matchesHint(message: string, hints: string[]): boolean {
  if (!message) {
    return false;
  }

  const normalized = message.toLowerCase();

  return hints.some((hint) => normalized.includes(hint));
}

function matchMessageMap(message: string): ErrorClassification | undefined {
  if (!message) {
    return undefined;
  }

  const normalized = message.toLowerCase();

  return SUPABASE_MESSAGE_MAP.find((entry) =>
    normalized.includes(entry.match),
  );
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "object" && error !== null && "message" in error) {
    const message = (error as { message?: unknown }).message;

    if (typeof message === "string") {
      return message;
    }
  }

  if (typeof error === "string") {
    return error;
  }

  return "";
}
