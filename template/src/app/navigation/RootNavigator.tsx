import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AppLoadingScreen } from "@/components/app/AppLoadingScreen";
import { RootStackParamList } from "@/app/navigation/types";
import { OnboardingScreen } from "@/features/onboarding/screens/OnboardingScreen";
import { AuthNavigator } from "@/app/navigation/AuthNavigator";
import { MainNavigator } from "@/app/navigation/MainNavigator";
import { useOnboardingStore } from "@/stores/onboardingStore";
import { useAuth } from "@/providers/AuthProvider";
import { useAuthFlowStore } from "@/stores/authFlowStore";

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const isOnboardingCompleted = useOnboardingStore(
    (state) => state.isCompleted,
  );
  const hasHydrated = useOnboardingStore((state) => state.hasHydrated);

  const { status } = useAuth();

  const authFlowHydrated = useAuthFlowStore((state) => state.hasHydrated);

  if (!hasHydrated || !authFlowHydrated || status === "initializing") {
    return <AppLoadingScreen />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isOnboardingCompleted ? (
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      ) : status === "authenticated" ? (
        <Stack.Screen name="Main" component={MainNavigator} />
      ) : (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      )}
    </Stack.Navigator>
  );
}
