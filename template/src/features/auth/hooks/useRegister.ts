import { signUpWithEmail } from '@/features/auth/services/authService';
import { useMutation } from '@tanstack/react-query';


export function useRegister() {
  return useMutation({
    mutationFn: ({
      name,
      surname,
      email,
      password,
    }: {
      name: string;
      surname: string;
      email: string;
      password: string;
    }) =>
      signUpWithEmail(
        name,
        surname,
        email,
        password,
      ),
  });
}