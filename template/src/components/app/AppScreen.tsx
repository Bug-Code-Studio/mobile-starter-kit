import type { PropsWithChildren } from 'react';
import type { ViewProps } from 'react-native';
import {
  SafeAreaView,
  type Edge,
} from 'react-native-safe-area-context';

import { Box } from '@/components/ui/box';

type ScreenProps = PropsWithChildren<
  ViewProps & {
    edges?: Edge[];
  }
>;

export function AppScreen({
  children,
  edges,
  className,
  ...props
}: ScreenProps) {
  return (
    <SafeAreaView
      edges={edges}
      className="flex-1 bg-background"
      style={{ flex: 1 }}
    >
      <Box className={`flex-1 bg-background ${className ?? ''}`} {...props}>
        {children}
      </Box>
    </SafeAreaView>
  );
}