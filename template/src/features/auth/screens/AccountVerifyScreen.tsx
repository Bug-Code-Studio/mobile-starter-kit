import {  Text } from 'react-native';
import { Screen } from '@/components/app/Screen';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '@/app/navigation/types';



type Props = NativeStackScreenProps<
  AuthStackParamList,
  'AccountVerify'
>;

export function AccountVerifyScreen({ route }: Props) {
  const { email, purpose } = route.params;

  return (
    <Screen className="flex-1 items-center justify-center">
      <Text className="text-2xl font-bold">
        Account Verify
      </Text>

      <Text className="mt-2">
        {email}
      </Text>

      <Text className="mt-2">
        {purpose}
      </Text>
    </Screen>
  );
}