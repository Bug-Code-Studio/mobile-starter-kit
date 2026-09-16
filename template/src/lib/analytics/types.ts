export type AnalyticsProperties = Record<string, unknown>;

export type AnalyticsTraits = Record<string, unknown>;

/**
 * Provider-agnostic analytics contract. Implement this to plug in a concrete
 * backend (Segment, PostHog, Amplitude, Firebase Analytics, etc.).
 */
export type AnalyticsProvider = {
  track(event: string, properties?: AnalyticsProperties): void;
  identify(userId: string, traits?: AnalyticsTraits): void;
  screen(name: string, properties?: AnalyticsProperties): void;
  reset(): void;
};
