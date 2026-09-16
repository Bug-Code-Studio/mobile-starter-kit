import type { AnalyticsProvider } from '@/lib/analytics/types';
import { posthog } from '@/lib/posthog/client';

// PostHog only accepts JSON-serializable properties; cast at the SDK boundary.
type PosthogProps = Record<string, unknown>;

export const posthogAnalyticsProvider: AnalyticsProvider = {
  track(event, properties) {
    posthog?.capture(event, properties as PosthogProps as never);
  },
  identify(userId, traits) {
    posthog?.identify(userId, traits as PosthogProps as never);
  },
  screen(name, properties) {
    posthog?.screen(name, properties as PosthogProps as never);
  },
  reset() {
    posthog?.reset();
  },
};
