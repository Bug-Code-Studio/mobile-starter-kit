import React, { useEffect } from 'react';
import { useColorScheme, View, ViewProps } from 'react-native';
import { OverlayProvider } from '@gluestack-ui/core/overlay/creator';
import { ToastProvider } from '@gluestack-ui/core/toast/creator';
import { Appearance, ColorSchemeName } from "react-native";

export type ModeType = 'light' | 'dark' | 'system';

export function GluestackUIProvider({
  mode = 'system',
  ...props
}: {
  mode?: ModeType;
  children?: React.ReactNode;
  style?: ViewProps['style'];
}) {
  const systemColorScheme = useColorScheme();
  const resolvedMode = mode === 'system' ? systemColorScheme ?? 'light' : mode;

  useEffect(() => {
    const colorScheme: ColorSchemeName = mode === 'system' ? 'unspecified' : mode;
    Appearance.setColorScheme(colorScheme);
  }, [mode]);

  return (
    <View
      style={[
        {
          flex: 1,
          height: '100%',
          width: '100%',
          backgroundColor: resolvedMode === 'dark' ? '#0a0a0a' : '#ffffff',
        },
        props.style,
      ]}
    >
      <OverlayProvider>
        <ToastProvider>{props.children}</ToastProvider>
      </OverlayProvider>
    </View>
  );
}
