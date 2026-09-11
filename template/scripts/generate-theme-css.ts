import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  colors,
  radii,
  shadows,
  spacing,
  typography,
  zIndex,
} from "../src/theme/tokens";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const outputPath = path.resolve(dirname, "..", "global.css");

const camelToKebab = (value: string) =>
  value.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);

const indent = (level: number) => "  ".repeat(level);

function colorVariables(scheme: "light" | "dark", level: number) {
  return Object.entries(colors[scheme])
    .map(
      ([key, value]) =>
        `${indent(level)}--${camelToKebab(key)}: ${value};`,
    )
    .join("\n");
}

function colorMappings() {
  return Object.keys(colors.light)
    .map((key) => {
      const name = camelToKebab(key);
      return `  --color-${name}: rgb(var(--${name}));`;
    })
    .join("\n");
}

function tokenScale(prefix: string, entries: Record<string, number>) {
  return Object.entries(entries)
    .map(([key, value]) => `  --${prefix}-${key}: ${value}px;`)
    .join("\n");
}

function shadowVariables() {
  return Object.entries(shadows)
    .filter(([key]) => key !== "none")
    .map(([key, shadow]) => {
      const { shadowOffset, shadowRadius, shadowOpacity } = shadow;
      return `  --shadow-${key}: 0 ${shadowOffset.height}px ${shadowRadius}px rgb(0 0 0 / ${shadowOpacity});`;
    })
    .join("\n");
}

function zIndexVariables() {
  return Object.entries(zIndex)
    .map(([key, value]) => `  --z-index-${key}: ${value};`)
    .join("\n");
}

const css = `@import "tailwindcss/theme.css" layer(theme);
@import "tailwindcss/preflight.css" layer(base);
@import "tailwindcss/utilities.css";
@import "nativewind/theme";

/* ─── Theme: design tokens (light / dark) ─────────────────────────
   GENERATED FILE — do not edit by hand.
   Edit src/theme/tokens.ts, then run: npm run theme:build

   1. :root              — light defaults (all platforms)
   2. @media dark :root  — dark defaults; nativewind maps this to
                           Appearance.getColorScheme() on native.
   3. :root.dark / :root.light — higher specificity for web class toggle. */
@layer theme {
  :root {
${colorVariables("light", 2)}
  }

  @media (prefers-color-scheme: dark) {
    :root {
${colorVariables("dark", 3)}
    }
  }

  :root.dark {
${colorVariables("dark", 2)}
  }

  :root.light {
${colorVariables("light", 2)}
  }
}

@theme inline {
${tokenScale("spacing", spacing)}
${tokenScale("radius", radii)}
${tokenScale("font-size", typography.fontSize)}
${tokenScale("line-height", typography.lineHeight)}
${shadowVariables()}
${zIndexVariables()}
${colorMappings()}
}
`;

async function main() {
  await fs.writeFile(outputPath, css, "utf8");
  console.log(`Generated ${path.relative(process.cwd(), outputPath)}`);
}

main();
