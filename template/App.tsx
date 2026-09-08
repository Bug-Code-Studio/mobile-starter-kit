import { NavigationContainer } from "@react-navigation/native";
import { linking } from "@/app/navigation/linking";
import { SafeAreaProvider } from "react-native-safe-area-context";

import "./global.css";

import { RootNavigator } from "@/app/navigation/RootNavigator";
import { AppProviders } from "@/providers/AppProviders";

export default function App() {
  return (
    <SafeAreaProvider>
      <AppProviders>
        <NavigationContainer linking={linking}>
          <RootNavigator />
        </NavigationContainer>
      </AppProviders>
    </SafeAreaProvider>
  );
}
