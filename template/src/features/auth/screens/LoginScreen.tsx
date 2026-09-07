import { Text } from 'react-native';
import { Screen } from '@/components/app/Screen';

export function LoginScreen() {
  return (
    <Screen className="flex-1 items-center justify-center">
      <Text className="text-2xl font-bold">
        Login
      </Text>
    </Screen>
  );
}