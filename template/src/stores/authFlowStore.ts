import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type AuthFlowState = {
  passwordResetPending: boolean;
  authResultPending: boolean;
  hasHydrated: boolean;
  setPasswordResetPending: (value: boolean) => void;
  setAuthResultPending: (value: boolean) => void;
};

export const useAuthFlowStore = create<AuthFlowState>()(
  persist(
    (set) => ({
      passwordResetPending: false,
      authResultPending: false,
      hasHydrated: false,
      setPasswordResetPending: (value: boolean) =>
        set({ passwordResetPending: value }),
      setAuthResultPending: (value: boolean) =>
        set({ authResultPending: value }),
    }),
    {
      name: "auth-flow-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        passwordResetPending: state.passwordResetPending,
      }),
      onRehydrateStorage: () => {
        return () => {
          useAuthFlowStore.setState({ hasHydrated: true });
        };
      },
    },
  ),
);
