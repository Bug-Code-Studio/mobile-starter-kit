import path from "node:path";
import process from "node:process";

import fs from "fs-extra";

import { createProject } from "./commands/create.js";

import { createProjectNames, validateProjectName } from "./utils/names.js";

import { resolvePackageManager } from "./utils/package-manager.js";

import { parseArgs } from "./utils/args.js";

import { error } from "./utils/logger.js";

import { showHelp } from "./utils/help.js";

import { promptProjectConfig } from "./utils/prompts.js";

async function main() {
  const args = process.argv.slice(2);

  if (args.includes("--help") || args.includes("-h")) {
    showHelp();
    return;
  }

  let parsedArgs;

  try {
    parsedArgs = parseArgs(args);
  } catch (error) {
    console.error(
      `\n✖ ${error instanceof Error ? error.message : "Invalid arguments."}`,
    );

    process.exit(1);
  }

  const {
    appName,
    packageManager: selectedPackageManager,
    noInstall,
    noGit,
  } = parsedArgs;

  const packageRoot = path.resolve(import.meta.dirname, "..");

  const templatePath = path.join(packageRoot, "template");

  if (!(await fs.pathExists(templatePath))) {
    error("Template directory not found.");
    process.exit(1);
  }

  /*
   * Interactive mode
   *
   * If no app name is provided, start the interactive
   * project creation wizard.
   */
  if (!appName) {
    const interactiveConfig = await promptProjectConfig();

    const projectConfig = {
      displayName: interactiveConfig.displayName,
      slug: interactiveConfig.slug,
      packageName: interactiveConfig.packageName,
      scheme: interactiveConfig.scheme,
      iosBundleIdentifier: interactiveConfig.iosBundleIdentifier,
      androidPackage: interactiveConfig.androidPackage,
    };

    const currentDirectory = process.env.INIT_CWD ?? process.cwd();

    const targetPath = path.resolve(
      currentDirectory,
      interactiveConfig.displayName,
    );

    if (await fs.pathExists(targetPath)) {
      error(`Directory "${interactiveConfig.displayName}" already exists.`);

      process.exit(1);
    }

    await createProject(
      projectConfig,
      templatePath,
      targetPath,
      interactiveConfig.packageManager,
      {
        install: interactiveConfig.install,
        git: interactiveConfig.git,
      },
    );

    return;
  }

  /*
   * Non-interactive mode
   *
   * Example:
   *
   * create-app MyApp
   * create-app MyApp --yarn
   * create-app MyApp --no-install --no-git
   */

  const validationError = validateProjectName(appName);

  if (validationError) {
    error(validationError);

    console.error("\nUsage: create-app <app-name> [options]");

    process.exit(1);
  }

  const projectNames = createProjectNames(appName);

  const projectConfig = {
    displayName: projectNames.displayName,
    slug: projectNames.slug,
    packageName: projectNames.packageName,
    scheme: projectNames.scheme,
    iosBundleIdentifier: `com.bugcodestudio.${projectNames.scheme}`,
    androidPackage: `com.bugcodestudio.${projectNames.scheme}`,
  };

  const packageManager = resolvePackageManager(selectedPackageManager);

  const currentDirectory = process.env.INIT_CWD ?? process.cwd();

  const targetPath = path.resolve(currentDirectory, appName);

  if (await fs.pathExists(targetPath)) {
    error(`Directory "${appName}" already exists.`);

    process.exit(1);
  }

  await createProject(projectConfig, templatePath, targetPath, packageManager, {
    install: !noInstall,
    git: !noGit,
  });
}

main().catch((error) => {
  console.error(
    `\n✖ ${
      error instanceof Error ? error.message : "An unexpected error occurred."
    }`,
  );

  process.exit(1);
});
