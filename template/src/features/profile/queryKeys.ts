import { createQueryKeys } from '@/lib/query/queryKeys';

export const profileKeys = createQueryKeys('profile', {
  me: () => [] as const,
});
