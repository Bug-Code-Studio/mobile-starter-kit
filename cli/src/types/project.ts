export type ProjectConfig = {
  displayName: string;
  slug: string;
  packageName: string;
  scheme: string;
  iosBundleIdentifier: string;
  androidPackage: string;
};

export type PackageManager =
  | 'npm'
  | 'yarn'
  | 'pnpm'
  | 'bun';