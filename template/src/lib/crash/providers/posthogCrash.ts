import type { CrashReporterProvider } from '@/lib/crash/types';
import { posthog } from '@/lib/posthog/client';

// PostHog only accepts JSON-serializable values; cast at the SDK boundary.
type PosthogProps = Record<string, unknown>;

export const posthogCrashProvider: CrashReporterProvider = {
  captureException(error, context) {
    posthog?.captureException(
      error instanceof Error ? error : new Error(String(error)),
      context as PosthogProps as never,
    );
  },
  captureMessage(message, level) {
    posthog?.capture('log_message', { message, level } as PosthogProps as never);
  },
  setUser(user) {
    if (user) {
      posthog?.identify(user.id, {
        email: user.email,
        username: user.username,
      } as PosthogProps as never);
    } else {
      posthog?.reset();
    }
  },
  addBreadcrumb(breadcrumb) {
    posthog?.capture('breadcrumb', { ...breadcrumb } as PosthogProps as never);
  },
};
