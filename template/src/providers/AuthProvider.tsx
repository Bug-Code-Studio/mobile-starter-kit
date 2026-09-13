import { supabase } from "@/lib/supabase/client";
import { logError } from "@/lib/errors";
import { useAuthFlowStore } from "@/stores/authFlowStore";
import type { AuthStatus } from "@/features/auth/types/authStatus";
import { Session, User } from "@supabase/supabase-js";
import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from "react";
import { AppState, type AppStateStatus } from "react-native";

type AuthContextValue = {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  status: AuthStatus;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const flow = useAuthFlowStore((state) => state.flow);
  const setFlow = useAuthFlowStore((state) => state.setFlow);

  useEffect(() => {
    let mounted = true;

    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (mounted) {
          setSession(data.session);
        }
      })
      .catch((error) => {
        logError(error, { source: "AuthProvider.getSession" });
      })
      .finally(() => {
        if (mounted) {
          setIsLoading(false);
        }
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (event, nextSession) => {
        setSession(nextSession);
        setIsLoading(false);

        // A dropped session (sign out or a failed token refresh) must clear any in-progress flow.
        if (event === "SIGNED_OUT") {
          setFlow("idle");
        }
      },
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [setFlow]);

  useEffect(() => {
    // Supabase only refreshes tokens while the app is foregrounded.
    const handleAppStateChange = (state: AppStateStatus) => {
      if (state === "active") {
        supabase.auth.startAutoRefresh();
      } else {
        supabase.auth.stopAutoRefresh();
      }
    };

    handleAppStateChange(AppState.currentState);

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange,
    );

    return () => {
      subscription.remove();
    };
  }, []);

  const status = useMemo<AuthStatus>(() => {
    if (isLoading) {
      return "initializing";
    }

    if (flow === "resetting-password") {
      return "resetting-password";
    }

    if (flow === "verifying-email") {
      return "verifying-email";
    }

    return session ? "authenticated" : "unauthenticated";
  }, [isLoading, flow, session]);

  const value = useMemo<AuthContextValue>(
    () => ({ session, user: session?.user ?? null, isLoading, status }),
    [session, isLoading, status]
  );
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
