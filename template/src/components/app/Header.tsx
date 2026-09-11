import type { PropsWithChildren, ReactNode } from 'react';
import { Text, View } from 'react-native';

import { BackButton } from './BackButton';

type HeaderProps = PropsWithChildren<{
  title: string;
  onBack?: () => void;
  right?: ReactNode;
}>;

export function Header({ title, onBack, right, children }: HeaderProps) {
  return (
    <View className="min-h-14 flex-row items-center gap-2 border-b border-border px-4">
      {onBack ? <BackButton onPress={onBack} /> : <View className="min-w-11" />}
      <Text
        accessibilityRole="header"
        className="flex-1 text-lg font-semibold text-foreground"
        numberOfLines={1}
      >
        {title}
      </Text>
      {right ?? children ?? <View className="min-w-11" />}
    </View>
  );
}