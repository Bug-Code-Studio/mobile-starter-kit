import { Ionicons } from '@expo/vector-icons';
import { Pressable, type PressableProps } from 'react-native';

type BackButtonProps = Omit<PressableProps, 'accessibilityRole' | 'children'> & {
  onPress: () => void;
  label?: string;
};

export function BackButton({
  onPress,
  label = 'Go back',
  className,
  ...props
}: BackButtonProps) {
  return (
    <Pressable
      {...props}
      accessibilityLabel={label}
      accessibilityRole="button"
      accessibilityHint="Returns to the previous screen"
      hitSlop={8}
      onPress={onPress}
      className={`min-h-11 min-w-11 items-center justify-center rounded-md ${className ?? ''}`}
    >
      <Ionicons name="arrow-back" size={22} color="currentColor" />
    </Pressable>
  );
}