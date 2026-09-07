import { NavigationContainer } from '@react-navigation/native';

import { RootNavigator } from '@/app/navigation/RootNavigator';
import { AppProviders } from '@/providers/AppProviders';

export default function App() {
  return (
    <AppProviders>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </AppProviders>
  );
}