import {
  configureAppJson,
  configurePackageJson,
} from '../utils/config.js';

import { copyTemplate } from '../utils/template.js';

import { installDependencies } from '../utils/install.js';

import { initializeGit } from '../utils/git.js';

import {
  blank,
  divider,
  info,
  step,
  success,
} from '../utils/logger.js';

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

  step('Copying template');

  await copyTemplate(
    templatePath,
    targetPath,
  );

  success('Template copied');

  step('Configuring package.json');

  await configurePackageJson(
    targetPath,
    names,
  );

  success('package.json configured');

  step('Configuring Expo');

  await configureAppJson(
    targetPath,
    names,
  );

  success('Expo configured');

  if (options.install) {
    step(
      `Installing dependencies with ${packageManager}`,
    );

    await installDependencies(
      packageManager,
      targetPath,
    );

    success('Dependencies installed');
  } else {
    info(
      'Skipping dependency installation (--no-install)',
    );
  }

  if (options.git) {
    step('Initializing Git');

    await initializeGit(
      targetPath,
    );

    success('Git initialized');
  } else {
    info(
      'Skipping Git initialization (--no-git)',
    );
  }

  divider();

  success(
    `${names.displayName} created successfully!`,
  );

  blank();

  console.log('Next steps:\n');

  console.log(`  cd ${names.displayName}`);
  console.log('  npx expo start');

  divider();
}