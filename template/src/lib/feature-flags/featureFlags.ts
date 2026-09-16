import { FEATURE_FLAGS, type FeatureFlag } from '@/lib/feature-flags/flags';

const overrides = new Map<FeatureFlag, boolean>();

/**
 * Provider-independent feature flag facade backed by local defaults. Runtime
 * overrides are useful for development and testing and take precedence over the
 * static defaults.
 */
export const featureFlags = {
  isEnabled(flag: FeatureFlag): boolean {
    return overrides.get(flag) ?? FEATURE_FLAGS[flag];
  },

  setOverride(flag: FeatureFlag, value: boolean): void {
    overrides.set(flag, value);
  },

  clearOverride(flag: FeatureFlag): void {
    overrides.delete(flag);
  },

  resetOverrides(): void {
    overrides.clear();
  },
} as const;
