import type {
  AnalyticsProperties,
  AnalyticsProvider,
  AnalyticsTraits,
} from '@/lib/analytics/types';

const isDev = typeof __DEV__ !== 'undefined' && __DEV__;

/**
 * Default provider used until a real backend is registered. It logs to the
 * console in development and stays silent in production.
 */
const noopProvider: AnalyticsProvider = {
  track(event, properties) {
    if (isDev) {
      console.info('[analytics] track', event, properties);
    }
  },
  identify(userId, traits) {
    if (isDev) {
      console.info('[analytics] identify', userId, traits);
    }
  },
  screen(name, properties) {
    if (isDev) {
      console.info('[analytics] screen', name, properties);
    }
  },
  reset() {
    if (isDev) {
      console.info('[analytics] reset');
    }
  },
};

let provider: AnalyticsProvider = noopProvider;

/**
 * Provider-agnostic analytics facade. Register a concrete provider once at app
 * startup with `analytics.setProvider(...)`.
 */
export const analytics = {
  setProvider(next: AnalyticsProvider): void {
    provider = next;
  },

  track(event: string, properties?: AnalyticsProperties): void {
    provider.track(event, properties);
  },

  identify(userId: string, traits?: AnalyticsTraits): void {
    provider.identify(userId, traits);
  },

  screen(name: string, properties?: AnalyticsProperties): void {
    provider.screen(name, properties);
  },

  reset(): void {
    provider.reset();
  },
} as const;
