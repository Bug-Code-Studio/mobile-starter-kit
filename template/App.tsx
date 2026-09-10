import '@/i18n';

import { NavigationContainer } from "@react-navigation/native";
import { linking } from "@/app/navigation/linking";
import { SafeAreaProvider } from "react-native-safe-area-context";

import "./global.css";

import { RootNavigator } from "@/app/navigation/RootNavigator";
import { AppProviders } from "@/providers/AppProviders";
import { ErrorBoundary } from "@/components/app/ErrorBoundary";

export default function App() {
  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <AppProviders>
          <NavigationContainer linking={linking}>
            <RootNavigator />
          </NavigationContainer>
        </AppProviders>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}
