import path from 'node:path';
import fs from 'fs-extra';

import type { ProjectNames } from '../types/project.js';

export async function configurePackageJson(
  targetPath: string,
  names: ProjectNames,
) {
  const packageJsonPath = path.join(
    targetPath,
    'package.json',
  );

  const packageJson = await fs.readJson(
    packageJsonPath,
  );

  packageJson.name = names.packageName;

  await fs.writeJson(
    packageJsonPath,
    packageJson,
    {
      spaces: 2,
    },
  );
}

export async function configureAppJson(
  targetPath: string,
  names: ProjectNames,
) {
  const appJsonPath = path.join(
    targetPath,
    'app.json',
  );

  const appJson = await fs.readJson(
    appJsonPath,
  );

  appJson.expo = {
    ...appJson.expo,
    name: names.displayName,
    slug: names.slug,
    scheme: names.scheme,
    ios: {
      ...appJson.expo?.ios,
      bundleIdentifier: `com.bugcodestudio.${names.scheme}`,
    },
    android: {
      ...appJson.expo?.android,
      package: `com.bugcodestudio.${names.scheme}`,
    },
  };

  await fs.writeJson(
    appJsonPath,
    appJson,
    {
      spaces: 2,
    },
  );
}