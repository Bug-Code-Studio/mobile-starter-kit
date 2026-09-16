import PostHog from 'posthog-react-native';

import { env } from '@/config/env';

/**
 * Shared PostHog instance. Null when no key is configured, which keeps the
 * analytics, crash and feature-flag providers as safe no-ops.
 */
export const posthog = env.posthogKey
  ? new PostHog(env.posthogKey, { host: env.posthogHost })
  : null;
