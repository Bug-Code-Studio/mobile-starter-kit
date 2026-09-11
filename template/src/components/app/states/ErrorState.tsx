import { useTranslation } from 'react-i18next';

import { Center } from '@/components/ui/center';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';

import { RetryButton } from './RetryButton';

type ErrorStateProps = {
  title?: string;
  message?: string;
  retryLabel?: string;
  onRetry?: () => void;
  retryLoading?: boolean;
};

export function ErrorState({
  title,
  message,
  retryLabel,
  onRetry,
  retryLoading = false,
}: ErrorStateProps) {
  const { t } = useTranslation();

  return (
    <Center className="flex-1 px-6">
      <VStack space="md" className="items-center">
        <Heading size="xl" className="text-center">
          {title ?? t('errors.errorState.title')}
        </Heading>

        <Text className="text-center text-typography-500">
          {message ?? t('errors.errorState.message')}
        </Text>

        {onRetry ? (
          <RetryButton
            onPress={onRetry}
            label={retryLabel ?? t('errors.errorState.retry')}
            loading={retryLoading}
          />
        ) : null}
      </VStack>
    </Center>
  );
}