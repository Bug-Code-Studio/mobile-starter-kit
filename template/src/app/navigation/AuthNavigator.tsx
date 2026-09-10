import { AuthStackParamList } from "@/app/navigation/types";
import { LoginScreen } from "@/features/auth/screens/LoginScreen";
import { RegisterScreen } from "@/features/auth/screens/RegisterScreen";
import { ForgotPasswordScreen } from "@/features/auth/screens/ForgotPasswordScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ResetPasswordScreen } from "@/features/auth/screens/ResetPasswordScreen";
import { OtpScreen } from "@/features/auth/screens/OtpScreen";

const Stack = createNativeStackNavigator<AuthStackParamList>();

export function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="OtpScreen" component={OtpScreen} />
      <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
    </Stack.Navigator>
  );
}
