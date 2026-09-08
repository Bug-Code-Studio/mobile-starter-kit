import { Text } from "@/components/ui/text";
import { AppScreen } from "@/components/app/AppScreen";

export function HomeScreen() {

  return (
    <AppScreen className="flex-1 items-center justify-center">
      <Text className="text-2xl font-bold">Home</Text>
    </AppScreen>
  );
}