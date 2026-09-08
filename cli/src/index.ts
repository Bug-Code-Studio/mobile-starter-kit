#!/usr/bin/env node

import path from "node:path";
import process from "node:process";

import fs from "fs-extra";

import { createProject } from "./commands/create.js";

import { createProjectNames, validateProjectName } from "./utils/names.js";
import { resolvePackageManager } from "./utils/project-manager.js";

async function main() {
  const args = process.argv.slice(2);

  const appName = args.find((arg) => !arg.startsWith("--"));

  const validationError = validateProjectName(appName);

  if (validationError) {
    console.error(`\n✖ ${validationError}\n`);

    console.error("Usage: create-app <app-name>");

    process.exit(1);
  }

  const projectNames = createProjectNames(appName!);

  const packageManager = resolvePackageManager(args);

  const cliRoot = path.resolve(import.meta.dirname, "..");

  const starterKitRoot = path.resolve(cliRoot, "..");

  const templatePath = path.join(starterKitRoot, "template");

  const targetPath = path.resolve(process.cwd(), appName!);

  if (!(await fs.pathExists(templatePath))) {
    console.error("\n✖ Template directory not found.\n");

    process.exit(1);
  }

  if (await fs.pathExists(targetPath)) {
    console.error(`\n✖ Directory "${appName}" already exists.\n`);

    process.exit(1);
  }

  console.log(`\nUsing ${packageManager}...\n`);

  await createProject(projectNames, templatePath, targetPath);
}

main().catch((error) => {
  console.error("\n✖ Failed to create project.");

  console.error(error);

  process.exit(1);
});
