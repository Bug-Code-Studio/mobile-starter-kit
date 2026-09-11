import {
  Button,
  ButtonSpinner,
  ButtonText,
} from '@/components/ui/button';

type RetryButtonProps = {
  onPress: () => void;
  label: string;
  loading?: boolean;
  disabled?: boolean;
};

export function RetryButton({
  onPress,
  label,
  loading = false,
  disabled = false,
}: RetryButtonProps) {
  return (
    <Button
      onPress={onPress}
      disabled={disabled || loading}
      className="mt-2"
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      {loading ? <ButtonSpinner /> : null}
      <ButtonText>{label}</ButtonText>
    </Button>
  );
}