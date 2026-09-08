#!/usr/bin/env node

import path from 'node:path';
import process from 'node:process';

import fs from 'fs-extra';

import { createProject } from './commands/create.js';

import {
  createProjectNames,
  validateProjectName,
} from './utils/names.js';

import {
  resolvePackageManager,
} from './utils/package-manager.js';

import { parseArgs } from './utils/args.js';

import { error } from './utils/logger.js';

import { showHelp } from './utils/help.js';

async function main() {
  const args = process.argv.slice(2);

  if (
    args.includes('--help') ||
    args.includes('-h')
  ) {
    showHelp();
    return;
  }

  let parsedArgs;

  try {
    parsedArgs = parseArgs(args);
  } catch (error) {
    console.error(
      `\n✖ ${
        error instanceof Error
          ? error.message
          : 'Invalid arguments.'
      }`,
    );

    process.exit(1);
  }

  const {
    appName,
    packageManager: selectedPackageManager,
    noInstall,
    noGit,
  } = parsedArgs;

  const validationError =
    validateProjectName(appName);

  if (validationError) {
    error(validationError);

    console.error(
      '\nUsage: create-app <app-name> [options]',
    );

    process.exit(1);
  }

  const projectNames =
    createProjectNames(appName!);

  const packageManager =
    resolvePackageManager(
      selectedPackageManager,
    );

  const cliRoot = path.resolve(
    import.meta.dirname,
    '..',
  );

  const starterKitRoot = path.resolve(
    cliRoot,
    '..',
  );

  const templatePath = path.join(
    starterKitRoot,
    'template',
  );

  const currentDirectory =
    process.env.INIT_CWD ?? process.cwd();

  const targetPath = path.resolve(
    currentDirectory,
    appName!,
  );

  if (!(await fs.pathExists(templatePath))) {
    error('Template directory not found.');

    process.exit(1);
  }

  if (await fs.pathExists(targetPath)) {
    error(
      `Directory "${appName}" already exists.`,
    );

    process.exit(1);
  }

  await createProject(
    projectNames,
    templatePath,
    targetPath,
    packageManager,
    {
      install: !noInstall,
      git: !noGit,
    },
  );
}

main().catch((error) => {
  console.error(
    `\n✖ ${
      error instanceof Error
        ? error.message
        : 'An unexpected error occurred.'
    }`,
  );

  process.exit(1);
});