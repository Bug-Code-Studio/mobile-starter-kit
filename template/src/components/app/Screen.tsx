import type { PropsWithChildren } from 'react';
import { View, type ViewProps } from 'react-native';
import {
  SafeAreaView,
  type Edge,
} from 'react-native-safe-area-context';

type ScreenProps = PropsWithChildren<
  ViewProps & {
    edges?: Edge[];
  }
>;

export function Screen({
  children,
  edges = ['top', 'bottom'],
  className,
  ...props
}: ScreenProps) {
  return (
    <SafeAreaView
      edges={edges}
      className={`flex-1 ${className ?? ''}`}
      {...props}
    >
      {children}
    </SafeAreaView>
  );
}