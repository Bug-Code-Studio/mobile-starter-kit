import { useMutation } from '@tanstack/react-query';

import { resendSignupOtp } from '@/features/auth/services/authService';

export function useResendSignupOtp() {
  return useMutation({
    mutationFn: (email: string) =>
      resendSignupOtp(email),
  });
}
