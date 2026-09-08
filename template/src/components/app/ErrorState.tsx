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
  title = 'Something went wrong',
  message = 'Please try again.',
  retryLabel = 'Try Again',
  onRetry,
}: ErrorStateProps) {
  return (
    <Center className="flex-1 px-6">
      <VStack space="md" className="items-center">
        <Heading size="xl" className="text-center">
          {title}
        </Heading>

        <Text className="text-center text-typography-500">
          {message}
        </Text>

        {onRetry ? (
          <Button onPress={onRetry} className="mt-2">
            <ButtonText>{retryLabel}</ButtonText>
          </Button>
        ) : null}
      </VStack>
    </Center>
  );
}