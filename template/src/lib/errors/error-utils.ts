import { AppError } from "./AppError";
import { ERROR_CODES, type ErrorCode } from "./error-codes";
import { ERROR_MESSAGE_KEYS } from "./error-messages";

type SupabaseErrorLike = {
  message?: string;
  code?: string;
  status?: number;
};

const SUPABASE_ERROR_MAP: Record<
  string,
  {
    code: ErrorCode;
  }
> = {
  invalid_credentials: {
    code: ERROR_CODES.AUTH_INVALID_CREDENTIALS,
  },

  email_not_confirmed: {
    code: ERROR_CODES.AUTH_EMAIL_NOT_CONFIRMED,
  },

  user_already_exists: {
    code: ERROR_CODES.AUTH_USER_ALREADY_EXISTS,
  },

  otp_expired: {
    code: ERROR_CODES.AUTH_OTP_EXPIRED,
  },

  invalid_otp: {
    code: ERROR_CODES.AUTH_INVALID_OTP,
  },
};

export function normalizeError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error;
  }

  if (isSupabaseError(error)) {
    const mapped = error.code ? SUPABASE_ERROR_MAP[error.code] : undefined;

    if (mapped) {
      return new AppError(error.message ?? "Supabase error", {
        code: mapped.code,
        userMessage: ERROR_MESSAGE_KEYS[mapped.code],
        cause: error,
      });
    }

    if (error.status && error.status >= 500) {
      return new AppError(error.message ?? "Database error", {
        code: ERROR_CODES.DATABASE,
        userMessage: ERROR_MESSAGE_KEYS[ERROR_CODES.DATABASE],
        cause: error,
      });
    }
  }

  if (isNetworkError(error)) {
    return new AppError("Network request failed", {
      code: ERROR_CODES.NETWORK,
      userMessage: ERROR_MESSAGE_KEYS[ERROR_CODES.NETWORK],
      cause: error,
    });
  }

  return new AppError(getErrorMessage(error), {
    code: ERROR_CODES.UNKNOWN,
    userMessage: ERROR_MESSAGE_KEYS[ERROR_CODES.UNKNOWN],
    cause: error,
  });
}

export function getUserErrorKey(error: unknown): string {
  return normalizeError(error).userMessage;
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

function isSupabaseError(error: unknown): error is SupabaseErrorLike {
  if (typeof error !== "object" || error === null) {
    return false;
  }

  const value = error as Record<string, unknown>;

  return "message" in value || "code" in value || "status" in value;
}

function isNetworkError(error: unknown): boolean {
  if (error instanceof TypeError) {
    return error.message.toLowerCase().includes("network");
  }

  return false;
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

  return "Unknown error";
}
