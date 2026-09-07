import { Text } from 'react-native';
import { Screen } from '@/components/app/Screen';

export function ResetPasswordScreen() {
  return (
    <Screen className="flex-1 items-center justify-center">
      <Text className="text-2xl font-bold">
        Reset Password
      </Text>
    </Screen>
  );
}