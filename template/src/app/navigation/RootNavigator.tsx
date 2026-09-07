import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/app/navigation/types";
import { OnboardingScreen } from "@/features/onboarding/screens/OnboardingScreen";
import { AuthNavigator } from "@/app/navigation/AuthNavigator";
import { MainNavigator } from "@/app/navigation/MainNavigator";

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />

      <Stack.Screen name="Auth" component={AuthNavigator} />

      <Stack.Screen name="Main" component={MainNavigator} />
    </Stack.Navigator>
  );
}
