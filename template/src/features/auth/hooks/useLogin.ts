import { signInWithEmail } from '@/features/auth/services/authService';
import { useMutation } from '@tanstack/react-query';


export function useLogin() {
  return useMutation({
    mutationFn: ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => signInWithEmail(email, password),
  });
}