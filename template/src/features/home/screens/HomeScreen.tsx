import { Text } from '@/components/ui/text';
import { Screen } from '@/components/app/AppScreen';

export function HomeScreen() {
  return (
    <Screen className="flex-1 items-center justify-center">
      <Text className="text-2xl font-bold">
        Home
      </Text>
    </Screen>
  );
}