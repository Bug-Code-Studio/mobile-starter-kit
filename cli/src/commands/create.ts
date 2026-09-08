import {
  configureAppJson,
  configurePackageJson,
} from '../utils/config.js';

import { copyTemplate } from '../utils/template.js';

import { installDependencies } from '../utils/install.js';

import { initializeGit } from '../utils/git.js';

import type {
  PackageManager,
  ProjectNames,
} from '../types/project.js';

type CreateProjectOptions = {
  install: boolean;
  git: boolean;
};

export async function createProject(
  names: ProjectNames,
  templatePath: string,
  targetPath: string,
  packageManager: PackageManager,
  options: CreateProjectOptions,
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

  if (options.install) {
    console.log(
      `\nInstalling dependencies with ${packageManager}...\n`,
    );

    await installDependencies(
      packageManager,
      targetPath,
    );
  } else {
    console.log(
      '\nSkipping dependency installation (--no-install).\n',
    );
  }

  if (options.git) {
    console.log(
      '\nInitializing Git...\n',
    );

    await initializeGit(
      targetPath,
    );
  } else {
    console.log(
      '\nSkipping Git initialization (--no-git).\n',
    );
  }

  console.log(
    `\nSuccessfully created ${names.displayName}!\n`,
  );
}