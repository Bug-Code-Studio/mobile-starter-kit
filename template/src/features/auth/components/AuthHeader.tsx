import type { ComponentType } from 'react';
import type { TextStyle } from 'react-native';

import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';

type AuthHeaderIconProps = {
  size?: number;
  color?: string;
  style?: TextStyle;
};

type AuthHeaderProps = {
  icon: ComponentType<AuthHeaderIconProps>;
  title: string;
  subtitle: string;
};

export function AuthHeader({
  icon,
  title,
  subtitle,
}: AuthHeaderProps) {
  return (
    <Box className="items-center">
      <Box className="h-16 w-16 items-center justify-center rounded-2xl border border-border bg-muted">
        {(() => {
          const HeaderIcon = icon;
          return <HeaderIcon size={32} color="#171717" />;
        })()}
      </Box>

      <Text className="mt-5 text-center text-3xl font-bold text-foreground">
        {title}
      </Text>

      <Text className="mt-2 text-center text-base text-muted-foreground">
        {subtitle}
      </Text>
    </Box>
  );
}
