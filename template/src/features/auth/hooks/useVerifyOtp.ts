import { useMutation } from '@tanstack/react-query';

import { verifyEmailOtp } from '@/features/auth/services/authService';
    
export function useVerifyOtp() {
  return useMutation({
    mutationFn: ({
      email,
      token,
      purpose,
    }: {
      email: string;
      token: string;
      purpose: 'email' | 'password-reset';
    }) =>
      verifyEmailOtp(
        email,
        token,
        purpose,
      ),
  });
}