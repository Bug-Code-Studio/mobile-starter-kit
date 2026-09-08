import path from 'node:path';
import fs from 'fs-extra';

import { toSlug } from '../utils/names.js';
import { copyTemplate } from '../utils/template.js';

async function updatePackageJson(
  targetPath: string,
  appName: string,
) {
  const packageJsonPath = path.join(targetPath, 'package.json');

  const packageJson = await fs.readJson(packageJsonPath);

  packageJson.name = toSlug(appName);

  await fs.writeJson(packageJsonPath, packageJson, {
    spaces: 2,
  });
}

async function updateAppJson(
  targetPath: string,
  appName: string,
) {
  const appJsonPath = path.join(targetPath, 'app.json');

  const appJson = await fs.readJson(appJsonPath);
  const slug = toSlug(appName);

  appJson.expo = {
    ...appJson.expo,
    name: appName,
    slug,
    scheme: slug,
  };

  await fs.writeJson(appJsonPath, appJson, {
    spaces: 2,
  });
}

export async function createProject(
  appName: string,
  templatePath: string,
  targetPath: string,
) {
  console.log(`\nCreating ${appName}...\n`);

  console.log('✔ Copying template...');

  await copyTemplate(templatePath, targetPath);

  console.log('✔ Configuring package.json...');

  await updatePackageJson(targetPath, appName);

  console.log('✔ Configuring Expo...');

  await updateAppJson(targetPath, appName);

  console.log(`\nSuccessfully created ${appName}!\n`);
}