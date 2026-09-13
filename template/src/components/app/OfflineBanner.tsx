import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Icon, SlashIcon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { useNetworkStatus } from '@/lib/network';

/** App-wide banner that appears while the device is offline and hides on reconnect. */
export function OfflineBanner() {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const { isOffline } = useNetworkStatus();

  if (!isOffline) {
    return null;
  }

  return (
    <Box
      className="absolute left-0 right-0 top-0 z-50 bg-destructive"
      style={{ paddingTop: insets.top }}
      accessibilityLiveRegion="polite"
      accessibilityRole="alert"
    >
      <HStack className="items-center justify-center gap-2 px-4 py-2">
        <Icon as={SlashIcon} size="sm" className="text-white" />
        <Text className="text-sm font-medium text-white">
          {t('network.offline.message')}
        </Text>
      </HStack>
    </Box>
  );
}
