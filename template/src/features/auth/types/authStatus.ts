export type AuthStatus =
  | "initializing"
  | "unauthenticated"
  | "authenticated"
  | "verifying-email"
  | "resetting-password";
