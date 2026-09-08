import {
  configureAppJson,
  configurePackageJson,
} from '../utils/config.js';

import { copyTemplate } from '../utils/template.js';

import { installDependencies } from '../utils/install.js';

import type {
  PackageManager,
  ProjectNames,
} from '../types/project.js';

export async function createProject(
  names: ProjectNames,
  templatePath: string,
  targetPath: string,
  packageManager: PackageManager,
) {
  console.log(
    `\nCreating ${names.displayName}...\n`,
  );

  console.log('✔ Copying template...');

  await copyTemplate(
    templatePath,
    targetPath,
  );

  console.log(
    '✔ Configuring package.json...',
  );

  await configurePackageJson(
    targetPath,
    names,
  );

  console.log('✔ Configuring Expo...');

  await configureAppJson(
    targetPath,
    names,
  );

  console.log(
    `\nInstalling dependencies with ${packageManager}...\n`,
  );

  await installDependencies(
    packageManager,
    targetPath,
  );

  console.log(
    `\nSuccessfully created ${names.displayName}!\n`,
  );
}