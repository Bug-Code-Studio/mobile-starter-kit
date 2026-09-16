import { featureFlags } from '@/lib/feature-flags/featureFlags';
import { FEATURE_FLAGS, type FeatureFlag } from '@/lib/feature-flags/flags';
import { posthog } from '@/lib/posthog/client';

/**
 * Pulls remote flag values from PostHog into the local override map so the
 * synchronous `featureFlags.isEnabled` API keeps working. Falls back to local
 * defaults when PostHog is not configured or a flag is missing.
 */
export async function syncPosthogFlags(): Promise<void> {
  const client = posthog;
  if (!client) {
    return;
  }

  await client.reloadFeatureFlagsAsync();

  (Object.keys(FEATURE_FLAGS) as FeatureFlag[]).forEach((flag) => {
    const value = client.isFeatureEnabled(flag);
    if (typeof value === 'boolean') {
      featureFlags.setOverride(flag, value);
    }
  });
}
