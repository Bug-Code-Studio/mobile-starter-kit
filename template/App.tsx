import "@/i18n";

import { SafeAreaProvider } from "react-native-safe-area-context";


import "./global.css";

import { RootNavigator } from "@/app/navigation/RootNavigator";
import { AppNavigationContainer } from "@/app/navigation/AppNavigationContainer";
import { AppProviders } from "@/providers/AppProviders";
import { ErrorBoundary } from "@/components/app/ErrorBoundary";

export default function App() {
  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <AppProviders>
          <AppNavigationContainer>
            <RootNavigator />
          </AppNavigationContainer>
        </AppProviders>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}
