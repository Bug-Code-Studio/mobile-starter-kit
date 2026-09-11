import {
  createNavigationContainerRef,
  type NavigationContainerRef,
} from '@react-navigation/native';

import type { RootStackParamList } from './types';

export const navigationRef =
  createNavigationContainerRef<RootStackParamList>();

export function navigate<RouteName extends keyof RootStackParamList>(
  ...args: undefined extends RootStackParamList[RouteName]
    ? [screen: RouteName] | [screen: RouteName, params: RootStackParamList[RouteName]]
    : [screen: RouteName, params: RootStackParamList[RouteName]]
) {
  if (navigationRef.isReady()) {
    const [screen, params] = args;
    const navigateOnRef = navigationRef.navigate as unknown as (
      screen: never,
      params?: never,
    ) => void;
    navigateOnRef(screen as never, params as never);
  }
}

export function goBack() {
  if (navigationRef.isReady() && navigationRef.canGoBack()) {
    navigationRef.goBack();
  }
}

export function getNavigationRef(): NavigationContainerRef<RootStackParamList> {
  return navigationRef;
}