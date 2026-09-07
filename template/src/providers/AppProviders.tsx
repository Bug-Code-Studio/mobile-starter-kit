import type { PropsWithChildren } from "react";

import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { QueryProvider } from "@/providers/QueryProvider";
import { AuthProvider } from "@/providers/AuthProvider";

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <GluestackUIProvider mode="system">
      <QueryProvider>
        <AuthProvider>{children}</AuthProvider>
      </QueryProvider>
    </GluestackUIProvider>
  );
}
