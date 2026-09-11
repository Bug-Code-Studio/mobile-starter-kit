import { Center } from '@/components/ui/center';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';

type EmptyStateProps = {
  title: string;
  message?: string;
  className?: string;
};

export function EmptyState({
  title,
  message,
  className,
}: EmptyStateProps) {
  return (
    <Center className={className}>
      <VStack space="md" className="items-center px-6">
        <Heading size="xl" className="text-center">
          {title}
        </Heading>

        {message ? (
          <Text className="text-center text-typography-500">
            {message}
          </Text>
        ) : null}
      </VStack>
    </Center>
  );
}