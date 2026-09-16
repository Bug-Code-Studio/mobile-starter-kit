import type { PropsWithChildren } from "react";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "react-native";
import { PostHogProvider } from "posthog-react-native";

import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { AppLoadingScreen } from "@/components/app/AppLoadingScreen";
import { OfflineBanner } from "@/components/app/OfflineBanner";
import { QueryProvider } from "@/providers/QueryProvider";
import { AuthProvider } from "@/providers/AuthProvider";
import { setupNetworkManagers } from "@/lib/network";
import { useThemeStore } from "@/stores/themeStore";
import { analytics } from "@/lib/analytics";
import { crashReporter } from "@/lib/crash";
import { posthog } from "@/lib/posthog/client";
import { posthogAnalyticsProvider } from "@/lib/analytics/providers/posthogAnalytics";
import { posthogCrashProvider } from "@/lib/crash/providers/posthogCrash";
import { syncPosthogFlags } from "@/lib/feature-flags/syncPosthogFlags";

setupNetworkManagers();

analytics.setProvider(posthogAnalyticsProvider);
crashReporter.setProvider(posthogCrashProvider);
void syncPosthogFlags();

// Enables autocapture and the usePostHog() hook; no-op when no key is set.
function ObservabilityProvider({ children }: PropsWithChildren) {
  if (!posthog) {
    return <>{children}</>;
  }

  return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}

export function AppProviders({ children }: PropsWithChildren) {
  const mode = useThemeStore((state) => state.mode);
  const hasHydrated = useThemeStore((state) => state.hasHydrated);
  const systemColorScheme = useColorScheme();
  const resolvedMode = mode === "system" ? systemColorScheme ?? "light" : mode;

  return (
    <GluestackUIProvider mode={mode}>
      <StatusBar style={resolvedMode === "dark" ? "light" : "dark"} />
      <ObservabilityProvider>
        <QueryProvider>
          <AuthProvider>
            {hasHydrated ? children : <AppLoadingScreen />}
          </AuthProvider>
          <OfflineBanner />
        </QueryProvider>
      </ObservabilityProvider>
    </GluestackUIProvider>
  );
}
