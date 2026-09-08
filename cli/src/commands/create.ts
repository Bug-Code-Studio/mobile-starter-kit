import {
  configureAppJson,
  configurePackageJson,
} from '../utils/config.js';

import { copyTemplate } from '../utils/template.js';

import type { ProjectNames } from '../types/project.js';

export async function createProject(
  names: ProjectNames,
  templatePath: string,
  targetPath: string,
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
    `\nSuccessfully created ${names.displayName}!\n`,
  );
}