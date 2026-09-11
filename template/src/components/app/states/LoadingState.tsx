import { Center } from '@/components/ui/center';
import { Spinner } from '@/components/ui/spinner';

type LoadingStateProps = {
  label?: string;
  className?: string;
};

export function LoadingState({
  label = 'Loading',
  className,
}: LoadingStateProps) {
  return (
    <Center className={className} accessibilityLabel={label}>
      <Spinner aria-label={label} size="large" />
    </Center>
  );
}