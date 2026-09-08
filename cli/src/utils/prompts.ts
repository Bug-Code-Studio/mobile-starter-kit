import * as p from "@clack/prompts";

import type { PackageManager, ProjectConfig } from "../types/project.js";

import { toPackageName, toScheme, toSlug } from "./names.js";

export type InteractiveProjectConfig = ProjectConfig & {
  packageManager: PackageManager;
  install: boolean;
  git: boolean;
};

function cancelIfNeeded<T>(value: T | symbol): T {
  if (p.isCancel(value)) {
    p.cancel("Operation cancelled.");
    process.exit(0);
  }

  return value as T;
}

export async function promptProjectConfig(): Promise<InteractiveProjectConfig> {
  p.intro("BugCode Studio Mobile Starter Kit");

  const displayName = cancelIfNeeded(
    await p.text({
      message: "What is your app name?",
      placeholder: "My Awesome App",
      validate(value) {
        if (!value?.trim()) {
          return "App name is required.";
        }

        if (value.trim().length > 50) {
          return "App name must be 50 characters or less.";
        }
      },
    }),
  );

  const defaultSlug = toSlug(displayName);

  const slug = cancelIfNeeded(
    await p.text({
      message: "What is your Expo slug?",
      initialValue: defaultSlug,
      validate(value) {
        if (!value?.trim()) {
          return "Slug is required.";
        }

        if (!/^[a-z0-9-]+$/.test(value.trim())) {
          return "Slug can only contain lowercase letters, numbers, and hyphens.";
        }
      },
    }),
  );

  const packageName = cancelIfNeeded(
    await p.text({
      message: "What is your package name?",
      initialValue: toPackageName(slug),
      validate(value) {
        if (!value?.trim()) {
          return "Package name is required.";
        }

        if (!/^[a-z0-9-]+$/.test(value.trim())) {
          return "Package name can only contain lowercase letters, numbers, and hyphens.";
        }
      },
    }),
  );

  const scheme = cancelIfNeeded(
    await p.text({
      message: "What is your URL scheme?",
      initialValue: toScheme(slug),
      validate(value) {
        if (!value?.trim()) {
          return "URL scheme is required.";
        }

        if (!/^[a-zA-Z][a-zA-Z0-9+.-]*$/.test(value.trim())) {
          return "Please enter a valid URL scheme.";
        }
      },
    }),
  );

  const iosBundleIdentifier = cancelIfNeeded(
    await p.text({
      message: "What is your iOS bundle identifier?",
      initialValue: `com.bugcodestudio.${toScheme(slug)}`,
      validate(value) {
        if (!value?.trim()) {
          return "iOS bundle identifier is required.";
        }

        if (!/^[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)+$/.test(value.trim())) {
          return "Please enter a valid bundle identifier.";
        }
      },
    }),
  );

  const androidPackage = cancelIfNeeded(
    await p.text({
      message: "What is your Android package name?",
      initialValue: iosBundleIdentifier,
      validate(value) {
        if (!value?.trim()) {
          return "Android package name is required.";
        }

        if (!/^[A-Za-z0-9_]+(\.[A-Za-z0-9_]+)+$/.test(value.trim())) {
          return "Please enter a valid Android package name.";
        }
      },
    }),
  );

  const packageManager = cancelIfNeeded(
    await p.select({
      message: "Which package manager do you want to use?",
      options: [
        {
          value: "npm",
          label: "npm",
        },
        {
          value: "yarn",
          label: "Yarn",
        },
        {
          value: "pnpm",
          label: "pnpm",
        },
        {
          value: "bun",
          label: "Bun",
        },
      ],
      initialValue: "npm",
    }),
  ) as PackageManager;

  const install = cancelIfNeeded(
    await p.confirm({
      message: "Install dependencies?",
      initialValue: true,
    }),
  );

  const git = cancelIfNeeded(
    await p.confirm({
      message: "Initialize Git?",
      initialValue: true,
    }),
  );

  const config: InteractiveProjectConfig = {
    displayName: displayName.trim(),
    slug: slug.trim(),
    packageName: packageName.trim(),
    scheme: scheme.trim(),
    iosBundleIdentifier: iosBundleIdentifier.trim(),
    androidPackage: androidPackage.trim(),
    packageManager,
    install,
    git,
  };

  p.outro("Configuration complete.");

  return config;
}
