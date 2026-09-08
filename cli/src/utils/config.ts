import path from 'node:path';
import fs from 'fs-extra';

import type { ProjectConfig } from '../types/project.js';

export async function configurePackageJson(
  targetPath: string,
  config: ProjectConfig,
) {
  const packageJsonPath = path.join(
    targetPath,
    'package.json',
  );

  const packageJson = await fs.readJson(
    packageJsonPath,
  );

  packageJson.name = config.packageName;

  await fs.writeJson(
    packageJsonPath,
    packageJson,
    {
      spaces: 2,
    },
  );
}

export async function configureAppConfig(
  targetPath: string,
  config: ProjectConfig,
) {
  const appConfigPath = path.join(
    targetPath,
    'app.config.ts',
  );

  let appConfig = await fs.readFile(
    appConfigPath,
    'utf8',
  );

  appConfig = appConfig
    .replace(
      /name:\s*['"][^'"]*['"]/,
      `name: '${config.displayName}'`,
    )
    .replace(
      /slug:\s*['"][^'"]*['"]/,
      `slug: '${config.slug}'`,
    )
    .replace(
      /scheme:\s*['"][^'"]*['"]/,
      `scheme: '${config.scheme}'`,
    );

  if (
    /bundleIdentifier:\s*['"][^'"]*['"]/.test(
      appConfig,
    )
  ) {
    appConfig = appConfig.replace(
      /bundleIdentifier:\s*['"][^'"]*['"]/,
      `bundleIdentifier: '${config.iosBundleIdentifier}'`,
    );
  } else {
    appConfig = appConfig.replace(
      /ios:\s*\{/,
      `ios: {
    bundleIdentifier: '${config.iosBundleIdentifier}',`,
    );
  }

  if (
    /package:\s*['"][^'"]*['"]/.test(
      appConfig,
    )
  ) {
    appConfig = appConfig.replace(
      /package:\s*['"][^'"]*['"]/,
      `package: '${config.androidPackage}'`,
    );
  } else {
    appConfig = appConfig.replace(
      /android:\s*\{/,
      `android: {
    package: '${config.androidPackage}',`,
    );
  }

  await fs.writeFile(
    appConfigPath,
    appConfig,
    'utf8',
  );
}