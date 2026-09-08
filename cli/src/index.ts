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

import { parseFlags } from './utils/flags.js';

import { error } from './utils/logger.js';

async function main() {
  const args = process.argv.slice(2);

  const appName = args.find(
    (arg) => !arg.startsWith('--'),
  );

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

  let cliOptions;

  try {
    cliOptions = parseFlags(args);
  } catch (error) {
    console.error(
      `\n✖ ${
        error instanceof Error
          ? error.message
          : 'Invalid options.'
      }`,
    );

    process.exit(1);
  }

  const packageManager =
    resolvePackageManager(
      cliOptions.packageManager,
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
      install: !cliOptions.noInstall,
      git: !cliOptions.noGit,
    },
  );
}

main().catch((error) => {
  console.error(
    '\n✖ Failed to create project.',
  );

  console.error(error);

  process.exit(1);
});