import { Center } from '@/components/ui/center';
import { ActivityIndicator } from 'react-native';


export function AppLoadingScreen() {
  return (
    <Center>
      <ActivityIndicator size="large" />
    </Center>
  );
}