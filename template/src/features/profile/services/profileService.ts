import { AppError } from '@/lib/errors/AppError';
import { ERROR_CODES } from '@/lib/errors/error-codes';
import { normalizeError } from '@/lib/errors';
import { supabase } from '@/lib/supabase/client';
import type { Profile } from '@/features/profile/types/profile';

/**
 * Reads the signed-in user's profile from Supabase auth metadata.
 * All Supabase access for this feature lives here — hooks and components never
 * touch the client directly (repository pattern).
 */
export async function getProfile(): Promise<Profile> {
  try {
    const { data, error } = await supabase.auth.getUser();

    if (error) {
      throw normalizeError(error);
    }

    const user = data.user;

    if (!user) {
      throw new AppError('No authenticated user found.', {
        code: ERROR_CODES.UNAUTHORIZED,
        messageKey: 'errors.unauthorized',
        reportable: false,
      });
    }

    const metadata = user.user_metadata ?? {};

    return {
      id: user.id,
      email: user.email ?? null,
      name: (metadata.name as string | undefined) ?? null,
      surname: (metadata.surname as string | undefined) ?? null,
    };
  } catch (error) {
    throw normalizeError(error);
  }
}
