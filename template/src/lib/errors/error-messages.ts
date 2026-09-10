import { ERROR_CODES, type ErrorCode } from "@/lib/errors/error-codes";

export const ERROR_MESSAGE_KEYS: Record<ErrorCode, string> = {
  [ERROR_CODES.UNKNOWN]: "errors.unknown",

  [ERROR_CODES.NETWORK]: "errors.network",

  [ERROR_CODES.TIMEOUT]: "errors.timeout",

  [ERROR_CODES.AUTH_INVALID_CREDENTIALS]: "errors.auth.invalidCredentials",

  [ERROR_CODES.AUTH_EMAIL_NOT_CONFIRMED]: "errors.auth.emailNotConfirmed",

  [ERROR_CODES.AUTH_USER_ALREADY_EXISTS]: "errors.auth.userAlreadyExists",

  [ERROR_CODES.AUTH_INVALID_OTP]: "errors.auth.invalidOtp",

  [ERROR_CODES.AUTH_OTP_EXPIRED]: "errors.auth.otpExpired",

  [ERROR_CODES.UNAUTHORIZED]: "errors.unauthorized",

  [ERROR_CODES.FORBIDDEN]: "errors.forbidden",

  [ERROR_CODES.NOT_FOUND]: "errors.notFound",

  [ERROR_CODES.RATE_LIMITED]: "errors.rateLimited",

  [ERROR_CODES.VALIDATION]: "errors.validation",

  [ERROR_CODES.DATABASE]: "errors.database",

  [ERROR_CODES.API]: "errors.api",
};
