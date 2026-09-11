export const spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
} as const;

export const radii = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
} as const;

export const typography = {
  fontFamily: {
    sans: "System",
    mono: "Menlo",
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    "2xl": 24,
    "3xl": 30,
  },
  lineHeight: {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 28,
    xl: 28,
    "2xl": 32,
    "3xl": 36,
  },
  fontWeight: {
    regular: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
  },
} as const;

export const colors = {
  light: {
    primary: "23 23 23",
    primaryForeground: "250 250 250",
    card: "255 255 255",
    secondary: "245 245 245",
    secondaryForeground: "23 23 23",
    background: "255 255 255",
    popover: "255 255 255",
    popoverForeground: "10 10 10",
    muted: "245 245 245",
    mutedForeground: "115 115 115",
    destructive: "231 0 11",
    foreground: "10 10 10",
    border: "229 229 229",
    input: "229 229 229",
    ring: "212 212 212",
    accent: "247 247 247",
    accentForeground: "52 52 52",
  },
  dark: {
    primary: "255 245 245",
    primaryForeground: "23 23 23",
    card: "23 23 23",
    secondary: "38 38 38",
    secondaryForeground: "250 250 250",
    background: "10 10 10",
    popover: "23 23 23",
    popoverForeground: "250 250 250",
    muted: "38 38 38",
    mutedForeground: "161 161 161",
    destructive: "255 100 103",
    foreground: "250 250 250",
    border: "46 46 46",
    input: "46 46 46",
    ring: "115 115 115",
    accent: "38 38 38",
    accentForeground: "250 250 250",
  },
} as const;

export const shadows = {
  none: {
    shadowColor: "transparent",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  lg: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.16,
    shadowRadius: 12,
    elevation: 8,
  },
} as const;

export const zIndex = {
  base: 0,
  raised: 1,
  dropdown: 10,
  sticky: 20,
  modal: 30,
  toast: 40,
  max: 50,
} as const;

export const tokens = {
  spacing,
  radii,
  typography,
  colors,
  shadows,
  zIndex,
} as const;

export type ThemeMode = "light" | "dark" | "system";
export type ColorScheme = Exclude<ThemeMode, "system">;