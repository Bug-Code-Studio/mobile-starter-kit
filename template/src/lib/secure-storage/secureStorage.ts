import * as SecureStore from 'expo-secure-store';

import { logger } from '@/lib/logger';

// expo-secure-store caps values at ~2KB on Android; suitable for tokens/secrets.

/**
 * Provider-independent secure storage facade backed by the device keychain
 * (iOS Keychain / Android Keystore) via expo-secure-store. All operations are
 * async and fail soft: reads return null and writes/removes are swallowed after
 * logging so storage errors never crash the caller.
 */
export const secureStorage = {
  async getItem(key: string): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      logger.error(`secureStorage.getItem failed for "${key}"`, error);
      return null;
    }
  },

  async setItem(key: string, value: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (error) {
      logger.error(`secureStorage.setItem failed for "${key}"`, error);
    }
  },

  async removeItem(key: string): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      logger.error(`secureStorage.removeItem failed for "${key}"`, error);
    }
  },
} as const;
