import { useQuery } from '@tanstack/react-query';

import { profileKeys } from '@/features/profile/queryKeys';
import { getProfile } from '@/features/profile/services/profileService';

export function useProfile() {
  return useQuery({
    queryKey: profileKeys.me(),
    queryFn: getProfile,
  });
}
