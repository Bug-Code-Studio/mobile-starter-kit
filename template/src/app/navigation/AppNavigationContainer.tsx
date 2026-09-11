import type { PropsWithChildren } from "react";
import { useColorScheme } from "react-native";
import { NavigationContainer } from "@react-navigation/native";

import { linking } from "@/app/navigation/linking";
import { navigationRef } from "@/app/navigation/helpers";
import { getNavigationTheme } from "@/app/navigation/navigationTheme";
import { useThemeStore } from "@/stores/themeStore";
import type { ColorScheme } from "@/theme";

export function AppNavigationContainer({ children }: PropsWithChildren) {
  const mode = useThemeStore((state) => state.mode);
  const systemColorScheme = useColorScheme();
  const resolvedMode: ColorScheme =
    mode === "system"
      ? systemColorScheme === "dark"
        ? "dark"
        : "light"
      : mode;

  return (
    <NavigationContainer
      linking={linking}
      ref={navigationRef}
      theme={getNavigationTheme(resolvedMode)}
    >
      {children}
    </NavigationContainer>
  );
}
