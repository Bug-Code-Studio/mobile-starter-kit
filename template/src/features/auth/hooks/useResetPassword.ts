import { useMutation } from '@tanstack/react-query';

import { updatePassword } from '@/features/auth/services/authService';

export function useResetPassword() {
  return useMutation({
    mutationFn: (password: string) =>
      updatePassword(password),
  });
}