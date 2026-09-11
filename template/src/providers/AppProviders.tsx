import type { PropsWithChildren } from "react";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "react-native";

import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { AppLoadingScreen } from "@/components/app/AppLoadingScreen";
import { QueryProvider } from "@/providers/QueryProvider";
import { AuthProvider } from "@/providers/AuthProvider";
import { useThemeStore } from "@/stores/themeStore";

export function AppProviders({ children }: PropsWithChildren) {
  const mode = useThemeStore((state) => state.mode);
  const hasHydrated = useThemeStore((state) => state.hasHydrated);
  const systemColorScheme = useColorScheme();
  const resolvedMode = mode === "system" ? systemColorScheme ?? "light" : mode;

  return (
    <GluestackUIProvider mode={mode}>
      <StatusBar style={resolvedMode === "dark" ? "light" : "dark"} />
      <QueryProvider>
        <AuthProvider>
          {hasHydrated ? children : <AppLoadingScreen />}
        </AuthProvider>
      </QueryProvider>
    </GluestackUIProvider>
  );
}
