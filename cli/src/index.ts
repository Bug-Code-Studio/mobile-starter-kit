#!/usr/bin/env node

import path from 'node:path';
import process from 'node:process';

import fs from 'fs-extra';

import { createProject } from './commands/create.js';
import { validateProjectName } from './utils/names.js';

async function main() {
  const appName = process.argv[2];

  // Project name validation
  const validationError = validateProjectName(appName);

  if (validationError) {
    console.error(`\n✖ ${validationError}\n`);
    console.error('Usage: create-app <app-name>');
    process.exit(1);
  }

  // Starter kit paths
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

  // Generated project path
  const targetPath = path.resolve(
    process.cwd(),
    appName!,
  );

  // Check template
  if (!(await fs.pathExists(templatePath))) {
    console.error(
      '\n✖ Template directory not found.\n',
    );
    process.exit(1);
  }

  // Check target directory
  if (await fs.pathExists(targetPath)) {
    console.error(
      `\n✖ Directory "${appName}" already exists.\n`,
    );
    process.exit(1);
  }

  // Create project
  await createProject(
    appName!,
    templatePath,
    targetPath,
  );
}

main().catch((error) => {
  console.error('\n✖ Failed to create project.');
  console.error(error);
  process.exit(1);
});