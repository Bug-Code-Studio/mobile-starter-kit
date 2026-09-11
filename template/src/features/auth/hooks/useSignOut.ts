import { useMutation } from '@tanstack/react-query';

import { signOut } from '@/features/auth/services/authService';

export function useSignOut() {
  return useMutation({
    mutationFn: () => signOut(),
  });
}
