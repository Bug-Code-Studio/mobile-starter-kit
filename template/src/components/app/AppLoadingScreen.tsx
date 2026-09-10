import { Center } from "@/components/ui/center";
import { AppScreen } from "@/components/app/AppScreen";
import { ActivityIndicator } from "react-native";

export function AppLoadingScreen() {
  return (
    <AppScreen className="flex-1">
      <Center>
        <ActivityIndicator size="large" />
      </Center>
    </AppScreen>
  );
}
