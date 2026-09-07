import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AppLoadingScreen } from "@/components/app/AppLoadingScreen";
import { RootStackParamList } from "@/app/navigation/types";
import { OnboardingScreen } from "@/features/onboarding/screens/OnboardingScreen";
import { AuthNavigator } from "@/app/navigation/AuthNavigator";
import { MainNavigator } from "@/app/navigation/MainNavigator";
import { useOnboardingStore } from "@/stores/onboardingStore";
import { useAuth } from "@/providers/AuthProvider";

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {

  const isOnboardingCompleted = useOnboardingStore((state) => state.isCompleted);
  const hasHydrated = useOnboardingStore((state) => state.hasHydrated);

  const {session, isLoading: isAuthLoading} = useAuth();

  if (!hasHydrated || isAuthLoading) {
    return <AppLoadingScreen />;
  }

  let initialRouteName: keyof RootStackParamList;
  if (!isOnboardingCompleted) {
    initialRouteName = "Onboarding";
  } else if (!session) {
    initialRouteName = "Auth";
  } else {
    initialRouteName = "Main";
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={initialRouteName}>
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />

      <Stack.Screen name="Auth" component={AuthNavigator} />

      <Stack.Screen name="Main" component={MainNavigator} />
    </Stack.Navigator>
  );
}
