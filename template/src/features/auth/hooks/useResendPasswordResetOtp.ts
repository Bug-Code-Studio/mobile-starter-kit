import { useMutation } from '@tanstack/react-query';

import { resendPasswordResetOtp } from '@/features/auth/services/authService';

export function useResendPasswordResetOtp() {
  return useMutation({
    mutationFn: (email: string) =>
      resendPasswordResetOtp(email),
  });
}
