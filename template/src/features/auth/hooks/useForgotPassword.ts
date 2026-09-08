import { sendPasswordResetOtp } from '@/features/auth/services/authService';
import { useMutation } from '@tanstack/react-query';


export function useForgotPassword() {
  return useMutation({
    mutationFn: (email: string) =>
      sendPasswordResetOtp(email),
  });
}