import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type AuthFlowPhase = "idle" | "verifying-email" | "resetting-password";

type AuthFlowState = {
  flow: AuthFlowPhase;
  hasHydrated: boolean;
  setFlow: (flow: AuthFlowPhase) => void;
};

export const useAuthFlowStore = create<AuthFlowState>()(
  persist(
    (set) => ({
      flow: "idle",
      hasHydrated: false,
      setFlow: (flow: AuthFlowPhase) => set({ flow }),
    }),
    {
      name: "auth-flow-storage",
      storage: createJSONStorage(() => AsyncStorage),
      // Only the recovery flow must survive a restart; other phases start fresh.
      partialize: (state) => ({
        flow:
          state.flow === "resetting-password" ? "resetting-password" : "idle",
      }),
      onRehydrateStorage: () => {
        return () => {
          useAuthFlowStore.setState({ hasHydrated: true });
        };
      },
    },
  ),
);
