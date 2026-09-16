import { Spinner } from "@/components/ui/spinner";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { AppScreen } from "@/components/app/AppScreen";
import { ErrorState } from "@/components/app/states/ErrorState";
import { useProfile } from "@/features/profile";
import { Box } from "@/components/ui/box";
import { Pressable } from "@/components/ui/pressable";
import { useSignOut } from "@/features/auth/hooks/useSignOut";
import { analytics } from "@/lib/analytics/analytics";

export function HomeScreen() {
  const { data: profile, isPending, isError, refetch } = useProfile();
  const { mutate: signOut } = useSignOut();

  const handleLogout = () => {
    // Implement your logout logic here
    analytics.track("logout_initiated");
    signOut();
    analytics.track("logout_completed");
  };
  if (isPending) {
    return (
      <AppScreen className="flex-1 items-center justify-center">
        <Spinner />
      </AppScreen>
    );
  }

  if (isError) {
    return (
      <AppScreen className="flex-1">
        <ErrorState onRetry={() => refetch()} />
      </AppScreen>
    );
  }

  return (
    <AppScreen className="flex-1 items-center justify-center">
      <VStack space="sm" className="items-center">
        <Text className="text-2xl font-bold">
          {profile.name ? `Hello, ${profile.name}` : "Home"}
        </Text>
        {profile.email ? (
          <Text className="text-typography-500">{profile.email}</Text>
        ) : null}

        <Pressable onPress={handleLogout}>
          <Text>Logout</Text>
        </Pressable>
      </VStack>
    </AppScreen>
  );
}
