import NetInfo from '@react-native-community/netinfo';
import { useEffect, useState } from 'react';

export type NetworkStatus = {
  isConnected: boolean;
  isInternetReachable: boolean | null;
  isOffline: boolean;
};

const INITIAL_STATUS: NetworkStatus = {
  isConnected: true,
  isInternetReachable: null,
  isOffline: false,
};

/**
 * Subscribes to device connectivity and reports a derived offline flag.
 * `isInternetReachable` starts as `null` while the first probe is in flight,
 * so we only treat the device as offline once it is explicitly `false`.
 */
export function useNetworkStatus(): NetworkStatus {
  const [status, setStatus] = useState<NetworkStatus>(INITIAL_STATUS);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      const isConnected = Boolean(state.isConnected);
      const isInternetReachable = state.isInternetReachable;

      setStatus({
        isConnected,
        isInternetReachable,
        isOffline: !isConnected || isInternetReachable === false,
      });
    });

    return unsubscribe;
  }, []);

  return status;
}
