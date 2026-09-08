import type { ProjectConfig } from '../types/project.js';

export function toSlug(value: string) {
  return value
    .trim()
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .replace(/[^a-zA-Z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();
}

export function toPackageName(value: string) {
  return toSlug(value);
}

export function toScheme(value: string) {
  return toSlug(value).replace(/-/g, '');
}

export function createProjectNames(
  input: string,
) {
  const displayName = input.trim();
  const slug = toSlug(displayName);
  const packageName = toPackageName(displayName);
  const scheme = toScheme(displayName);

  return {
    displayName,
    slug,
    packageName,
    scheme,
  };
}

export function validateProjectName(
  input: string | undefined,
) {
  if (!input) {
    return 'Project name is required.';
  }

  const name = input.trim();

  if (!name) {
    return 'Project name cannot be empty.';
  }

  if (name.length > 50) {
    return 'Project name must be 50 characters or less.';
  }

  const slug = toSlug(name);

  if (!slug) {
    return 'Project name contains no valid characters.';
  }

  if (slug.length > 50) {
    return 'Project name is too long.';
  }

  if (/^[0-9]/.test(slug)) {
    return 'Project name cannot start with a number.';
  }

  return null;
}

export function validateSlug(
  value: string | undefined,
) {
  if (!value?.trim()) {
    return 'Slug is required.';
  }

  const slug = value.trim();

  if (slug.length > 50) {
    return 'Slug must be 50 characters or less.';
  }

  if (!/^[a-z0-9-]+$/.test(slug)) {
    return 'Slug can only contain lowercase letters, numbers, and hyphens.';
  }

  if (/^-|-$/.test(slug)) {
    return 'Slug cannot start or end with a hyphen.';
  }

  return null;
}

export function validatePackageName(
  value: string | undefined,
) {
  if (!value?.trim()) {
    return 'Package name is required.';
  }

  const packageName = value.trim();

  if (packageName.length > 50) {
    return 'Package name must be 50 characters or less.';
  }

  if (!/^[a-z0-9-]+$/.test(packageName)) {
    return 'Package name can only contain lowercase letters, numbers, and hyphens.';
  }

  return null;
}

export function validateScheme(
  value: string | undefined,
) {
  if (!value?.trim()) {
    return 'URL scheme is required.';
  }

  const scheme = value.trim();

  if (!/^[a-zA-Z][a-zA-Z0-9+.-]*$/.test(scheme)) {
    return 'Please enter a valid URL scheme.';
  }

  return null;
}

export function validateBundleIdentifier(
  value: string | undefined,
) {
  if (!value?.trim()) {
    return 'Bundle identifier is required.';
  }

  const identifier = value.trim();

  if (
    !/^[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)+$/.test(
      identifier,
    )
  ) {
    return 'Please enter a valid bundle identifier.';
  }

  return null;
}

export function validateAndroidPackage(
  value: string | undefined,
) {
  if (!value?.trim()) {
    return 'Android package name is required.';
  }

  const packageName = value.trim();

  if (
    !/^[A-Za-z0-9_]+(\.[A-Za-z0-9_]+)+$/.test(
      packageName,
    )
  ) {
    return 'Please enter a valid Android package name.';
  }

  return null;
}

export function createProjectConfig(
  config: ProjectConfig,
): ProjectConfig {
  return {
    displayName: config.displayName.trim(),
    slug: config.slug.trim(),
    packageName: config.packageName.trim(),
    scheme: config.scheme.trim(),
    iosBundleIdentifier:
      config.iosBundleIdentifier.trim(),
    androidPackage:
      config.androidPackage.trim(),
  };
}