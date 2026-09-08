export type ProjectNames = {
  displayName: string;
  slug: string;
  packageName: string;
  scheme: string;
};

export type PackageManager =
  | 'npm'
  | 'yarn'
  | 'pnpm'
  | 'bun';