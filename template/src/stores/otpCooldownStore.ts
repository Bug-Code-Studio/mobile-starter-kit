import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const RESEND_COOLDOWN_SECONDS = 60;

type OtpCooldownState = {
  // Maps a cooldown key (`${purpose}:${email}`) to its expiry timestamp in ms.
  expiries: Record<string, number>;
  hasHydrated: boolean;
  startCooldown: (key: string, seconds: number) => void;
  clearCooldown: (key: string) => void;
};

export const useOtpCooldownStore = create<OtpCooldownState>()(
  persist(
    (set) => ({
      expiries: {},
      hasHydrated: false,
      startCooldown: (key, seconds) =>
        set((state) => ({
          expiries: {
            ...state.expiries,
            [key]: Date.now() + seconds * 1000,
          },
        })),
      clearCooldown: (key) =>
        set((state) => {
          const next = { ...state.expiries };
          delete next[key];
          return { expiries: next };
        }),
    }),
    {
      name: "otp-cooldown-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ expiries: state.expiries }),
      onRehydrateStorage: () => {
        return () => {
          useOtpCooldownStore.setState({ hasHydrated: true });
        };
      },
    },
  ),
);
