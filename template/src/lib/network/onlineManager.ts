import NetInfo from '@react-native-community/netinfo';
import { focusManager, onlineManager } from '@tanstack/react-query';
import { AppState, type AppStateStatus, Platform } from 'react-native';

let isConfigured = false;

/**
 * Bridges React Native connectivity and app focus into TanStack Query so queries
 * pause while offline and automatically refetch on reconnect / foreground.
 * Safe to call multiple times; only the first call takes effect.
 */
export function setupNetworkManagers(): void {
  if (isConfigured) {
    return;
  }

  isConfigured = true;

  onlineManager.setEventListener((setOnline) =>
    NetInfo.addEventListener((state) => {
      setOnline(
        Boolean(state.isConnected) && state.isInternetReachable !== false,
      );
    }),
  );

  AppState.addEventListener('change', (status: AppStateStatus) => {
    if (Platform.OS !== 'web') {
      focusManager.setFocused(status === 'active');
    }
  });
}
