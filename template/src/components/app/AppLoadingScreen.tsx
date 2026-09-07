import { ActivityIndicator } from 'react-native';

import { Screen } from '@/components/app/Screen';

export function AppLoadingScreen() {
  return (
    <Screen className="items-center justify-center">
      <ActivityIndicator size="large" />
    </Screen>
  );
}