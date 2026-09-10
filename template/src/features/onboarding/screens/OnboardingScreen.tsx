import { useOnboardingStore } from "@/stores/onboardingStore";
import { Text } from "@/components/ui/text";
import { Pressable } from "@/components/ui/pressable";
import { AppScreen } from "@/components/app/AppScreen";

import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/app/navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "Onboarding">;

export function OnboardingScreen({ navigation }: Props) {
  const completeOnboarding = useOnboardingStore(
    (state) => state.completeOnboarding,
  );

  const handleComplete = () => {
    completeOnboarding();
  };

  return (
    <AppScreen className="items-center justify-center px-6">
      <Text className="text-3xl font-bold">Welcome</Text>

      <Text className="mt-4 text-center text-base">
        Welcome to your new app.
      </Text>

      <Pressable
        className="mt-8 rounded-xl bg-primary-500 px-6 py-4"
        onPress={handleComplete}
      >
        <Text className="font-semibold text-white">Get Started</Text>
      </Pressable>
    </AppScreen>
  );
}
