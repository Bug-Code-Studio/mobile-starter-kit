import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';

import { logError, normalizeError } from '@/lib/errors';

const MAX_RETRIES = 2;

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
            staleTime: 1000 * 60,
            retry: (failureCount, error) => {
                if (!normalizeError(error).retryable) {
                    return false;
                }

                return failureCount < MAX_RETRIES;
            },
        },
        mutations: {
            retry: false,
        },
    },
});