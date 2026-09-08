import { supabase } from '@/lib/supabase/client';

export async function signInWithEmail(
  email: string,
  password: string,
) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  return data;
}

export async function signUpWithEmail(
  name: string,
  surname: string,
  email: string,
  password: string,
) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
        surname,
      },
    },
  });

  if (error) {
    throw error;
  }

  return data;
}

export async function sendPasswordResetOtp(email: string) {
  const { error } =
    await supabase.auth.resetPasswordForEmail(email);

  if (error) {
    throw error;
  }
}

export async function verifyEmailOtp(
  email: string,
  token: string,
  purpose: 'signup' | 'password-reset',
) {
  const type = purpose === 'signup' ? 'email' : 'recovery';

  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token,
    type,
  });

  if (error) {
    throw error;
  }

  return data;
}

export async function resendSignupOtp(email: string) {
  const { data, error } = await supabase.auth.resend({
    type: 'signup',
    email,
  });

  if (error) {
    throw error;
  }

  return data;
}

export async function resendPasswordResetOtp(email: string) {
  const { error } =
    await supabase.auth.resetPasswordForEmail(email);

  if (error) {
    throw error;
  }
}

export async function updatePassword(password: string) {
  const { data, error } =
    await supabase.auth.updateUser({
      password,
    });

  if (error) {
    throw error;
  }

  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw error;
  }
}