import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';

import { logError, normalizeError } from '@/lib/errors';

/** Shared query defaults. Tune here to change behaviour app-wide. */
export const QUERY_STALE_TIME = 1000 * 60; // 1 minute
export const QUERY_GC_TIME = 1000 * 60 * 5; // 5 minutes
export const QUERY_MAX_RETRIES = 2;

/** Only retry transient (retryable) failures, up to QUERY_MAX_RETRIES times. */
export function shouldRetryQuery(
    failureCount: number,
    error: unknown,
): boolean {
    if (!normalizeError(error).retryable) {
        return false;
    }

    return failureCount < QUERY_MAX_RETRIES;
}

export const queryClient = new QueryClient({
    queryCache: new QueryCache({
        onError: (error) => {
            if (normalizeError(error).reportable) {
                logError(error, { source: 'query' });
            }
        },
    }),
    mutationCache: new MutationCache({
        onError: (error) => {
            if (normalizeError(error).reportable) {
                logError(error, { source: 'mutation' });
            }
        },
    }),
    defaultOptions: {
        queries: {
            staleTime: QUERY_STALE_TIME,
            gcTime: QUERY_GC_TIME,
            retry: shouldRetryQuery,
        },
        mutations: {
            retry: false,
        },
    },
});