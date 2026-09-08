import type { ElementType } from 'react';

import { Box } from '@/components/ui/box';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';

type AuthHeaderProps = {
  icon: ElementType;
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
        <Icon
          as={icon}
          size="xl"
          className="text-foreground"
        />
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
