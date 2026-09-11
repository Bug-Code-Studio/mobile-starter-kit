import {
  DarkTheme,
  DefaultTheme,
  type Theme,
} from "@react-navigation/native";

import { colors, type ColorScheme } from "@/theme";

const toRgb = (triplet: string) => `rgb(${triplet.split(" ").join(", ")})`;

export function getNavigationTheme(scheme: ColorScheme): Theme {
  const base = scheme === "dark" ? DarkTheme : DefaultTheme;
  const palette = colors[scheme];

  return {
    ...base,
    colors: {
      ...base.colors,
      primary: toRgb(palette.primary),
      background: toRgb(palette.background),
      card: toRgb(palette.card),
      text: toRgb(palette.foreground),
      border: toRgb(palette.border),
      notification: toRgb(palette.destructive),
    },
  };
}
