/**
 * Local, provider-independent feature flag defaults. Add flag keys here with a
 * boolean default. This map can later be overridden by a remote source without
 * changing call sites (`featureFlags.isEnabled('...')`).
 */
export const FEATURE_FLAGS = {
  'new-home': false,
} as const;

export type FeatureFlag = keyof typeof FEATURE_FLAGS;
