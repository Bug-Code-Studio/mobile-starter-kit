import type { ProjectNames } from "../types/project.js";

export function toSlug(value: string) {
  return value
    .trim()
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .replace(/[^a-zA-Z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}

export function toPackageName(value: string) {
  return toSlug(value);
}

export function toScheme(value: string) {
  return toSlug(value).replace(/-/g, "");
}

export function createProjectNames(input: string): ProjectNames {
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

export function validateProjectName(input: string | undefined) {
  if (!input) {
    return "Project name is required.";
  }

  const name = input.trim();

  if (!name) {
    return "Project name cannot be empty.";
  }

  if (name.length > 50) {
    return "Project name must be 50 characters or less.";
  }

  const slug = toSlug(name);

  if (!slug) {
    return "Project name contains no valid characters.";
  }

  if (slug.length > 50) {
    return "Project name is too long.";
  }

  if (/^[0-9]/.test(slug)) {
    return "Project name cannot start with a number.";
  }

  return null;
}
