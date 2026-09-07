import { useOnboardingStore } from "@/stores/onboardingStore";
import { Text, Pressable } from "react-native";
import { Screen } from "@/components/app/Screen";

export function OnboardingScreen() {
  const completeOnboarding = useOnboardingStore(
    (state) => state.completeOnboarding,
  );

  return (
    <Screen className="items-center justify-center px-6">
      <Text className="text-3xl font-bold">Welcome</Text>

      <Text className="mt-4 text-center text-base">
        Welcome to your new app.
      </Text>

      <Pressable
        className="mt-8 rounded-xl bg-primary-500 px-6 py-4"
        onPress={completeOnboarding}
      >
        <Text className="font-semibold text-white">Get Started</Text>
      </Pressable>
    </Screen>
  );
}
