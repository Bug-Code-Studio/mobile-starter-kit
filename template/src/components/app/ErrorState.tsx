import { useTranslation } from 'react-i18next';

import { Button, ButtonText } from '@/components/ui/button';
import { Center } from '@/components/ui/center';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';

type ErrorStateProps = {
  title?: string;
  message?: string;
  retryLabel?: string;
  onRetry?: () => void;
};

export function ErrorState({
  title,
  message,
  retryLabel,
  onRetry,
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
          <Button onPress={onRetry} className="mt-2">
            <ButtonText>{retryLabel ?? t('errors.errorState.retry')}</ButtonText>
          </Button>
        ) : null}
      </VStack>
    </Center>
  );
}