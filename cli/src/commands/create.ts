import fs from 'fs-extra';

import {
  configureAppConfig,
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

import { bold, cyan, dim, red } from '../utils/colors.js';

import type {
  PackageManager,
  ProjectConfig,
} from '../types/project.js';

type CreateProjectOptions = {
  install: boolean;
  git: boolean;
};

export async function createProject(
  names: ProjectConfig,
  templatePath: string,
  targetPath: string,
  packageManager: PackageManager,
  options: CreateProjectOptions,
) {
  console.log(
    `\n${bold(`Creating ${names.displayName}`)}${dim(' with the BugCode Studio starter kit...')}\n`,
  );

  const startTime = Date.now();

  const totalSteps = 3 + (options.install ? 1 : 0) + (options.git ? 1 : 0);

  let currentStep = 0;

  try {
    step('Copying template', ++currentStep, totalSteps);

    await copyTemplate(
      templatePath,
      targetPath,
    );

    success('Template copied');

    step('Configuring package.json', ++currentStep, totalSteps);

    await configurePackageJson(
      targetPath,
      names,
    );

    success('package.json configured');

    step('Configuring Expo', ++currentStep, totalSteps);

    await configureAppConfig(
      targetPath,
      names,
    );

    success('Expo configured');

    if (options.install) {
      step(
        `Installing dependencies with ${packageManager}`,
        ++currentStep,
        totalSteps,
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
      step('Initializing Git', ++currentStep, totalSteps);

      await initializeGit(
        targetPath,
      );

      success('Git initialized');
    } else {
      info(
        'Skipping Git initialization (--no-git)',
      );
    }

    const elapsedSeconds = ((Date.now() - startTime) / 1000).toFixed(1);

    divider();

    success(
      `${bold(names.displayName)} created successfully! ${dim(`(${elapsedSeconds}s)`)}`,
    );

    blank();

    console.log(bold('Next steps:'));
    blank();

    console.log(`  ${cyan(`cd ${names.displayName}`)}`);
    console.log(`  ${cyan('npx expo start')}`);

    divider();
  } catch (error) {
    console.error(
      `\n${red('✖')} Project creation failed.`,
    );

    if (await fs.pathExists(targetPath)) {
      console.log(
        dim('Cleaning up incomplete project...'),
      );

      try {
        await fs.remove(targetPath);

        success(
          'Incomplete project removed',
        );
      } catch (cleanupError) {
        console.error(
          '\n✖ Failed to clean up incomplete project.',
        );

        console.error(cleanupError);
      }
    }

    throw error;
  }
}