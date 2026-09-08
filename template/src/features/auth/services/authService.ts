import { supabase } from '@/lib/supabase/client';
import { normalizeError } from '@/lib/errors';

export async function signInWithEmail(
  email: string,
  password: string,
) {
  try {
    const { data, error } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (error) {
      throw normalizeError(error);
    }

    return data;
  } catch (error) {
    throw normalizeError(error);
  }
}

export async function signUpWithEmail(
  name: string,
  surname: string,
  email: string,
  password: string,
) {
  try {
    const { data, error } =
      await supabase.auth.signUp({
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
      throw normalizeError(error);
    }

    return data;
  } catch (error) {
    throw normalizeError(error);
  }
}

export async function sendPasswordResetOtp(
  email: string,
) {
  try {
    const { error } =
      await supabase.auth.resetPasswordForEmail(
        email,
      );

    if (error) {
      throw normalizeError(error);
    }
  } catch (error) {
    throw normalizeError(error);
  }
}

export async function verifyEmailOtp(
  email: string,
  token: string,
  purpose: 'signup' | 'password-reset',
) {
  try {
    const type =
      purpose === 'signup'
        ? 'email'
        : 'recovery';

    const { data, error } =
      await supabase.auth.verifyOtp({
        email,
        token,
        type,
      });

    if (error) {
      throw normalizeError(error);
    }

    return data;
  } catch (error) {
    throw normalizeError(error);
  }
}

export async function resendSignupOtp(
  email: string,
) {
  try {
    const { data, error } =
      await supabase.auth.resend({
        type: 'signup',
        email,
      });

    if (error) {
      throw normalizeError(error);
    }

    return data;
  } catch (error) {
    throw normalizeError(error);
  }
}

export async function resendPasswordResetOtp(
  email: string,
) {
  try {
    const { error } =
      await supabase.auth.resetPasswordForEmail(
        email,
      );

    if (error) {
      throw normalizeError(error);
    }
  } catch (error) {
    throw normalizeError(error);
  }
}

export async function updatePassword(
  password: string,
) {
  try {
    const { data, error } =
      await supabase.auth.updateUser({
        password,
      });

    if (error) {
      throw normalizeError(error);
    }

    return data;
  } catch (error) {
    throw normalizeError(error);
  }
}

export async function signOut() {
  try {
    const { error } =
      await supabase.auth.signOut();

    if (error) {
      throw normalizeError(error);
    }
  } catch (error) {
    throw normalizeError(error);
  }
}