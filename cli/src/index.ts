#!/usr/bin/env node

import path from 'node:path';
import process from 'node:process';

import fs from 'fs-extra';
import { createProject } from './commands/create.js';



async function main() {
  const appName = process.argv[2];

  if (!appName) {
    console.error('Usage: create-app <app-name>');
    process.exit(1);
  }

  const cliRoot = path.resolve(import.meta.dirname, '..');
  const starterKitRoot = path.resolve(cliRoot, '..');

  const templatePath = path.join(
    starterKitRoot,
    'template',
  );

  const targetPath = path.resolve(
    process.cwd(),
    appName,
  );

  if (!(await fs.pathExists(templatePath))) {
    console.error('Template directory not found.');
    process.exit(1);
  }

  if (await fs.pathExists(targetPath)) {
    console.error(
      `Directory "${appName}" already exists.`,
    );
    process.exit(1);
  }

  await createProject(
    appName,
    templatePath,
    targetPath,
  );
}

main().catch((error) => {
  console.error('\nFailed to create project.');
  console.error(error);
  process.exit(1);
});