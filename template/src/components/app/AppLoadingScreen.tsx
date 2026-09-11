import { AppScreen } from '@/components/app/AppScreen';
import { LoadingState } from '@/components/app/states/LoadingState';

export function AppLoadingScreen() {
  return (
    <AppScreen className="flex-1 justify-center">
      <LoadingState />
    </AppScreen>
  );
}
