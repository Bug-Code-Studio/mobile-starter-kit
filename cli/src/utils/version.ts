import path from 'node:path';

import fs from 'fs-extra';

// Reads the CLI's own version from package.json at runtime.
// packageRoot resolves to the CLI package directory in both dev
// (src/) and the published package (dist/), where package.json lives.
export async function getVersion(): Promise<string> {
  const packageRoot = path.resolve(import.meta.dirname, '..', '..');

  const packageJsonPath = path.join(packageRoot, 'package.json');

  try {
    const packageJson = await fs.readJson(packageJsonPath);

    if (typeof packageJson.version === 'string') {
      return packageJson.version;
    }
  } catch {
    // Fall through to unknown.
  }

  return 'unknown';
}
