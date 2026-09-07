import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type OnboardingState = {
  isCompleted: boolean;
  hasHydrated: boolean;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
};

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      isCompleted: false,
      hasHydrated: false,

      completeOnboarding: () => set({ isCompleted: true }),
      resetOnboarding: () => set({ isCompleted: false }),
    }),
    {
      name: "onboarding-storage",
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => {
        return () => {
          useOnboardingStore.setState({ hasHydrated: true });
        };
      },
    },
  ),
);
