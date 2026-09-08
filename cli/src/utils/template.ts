import path from 'node:path';
import fs from 'fs-extra';

export async function copyTemplate(
  templatePath: string,
  targetPath: string,
) {
  await fs.copy(templatePath, targetPath, {
    filter: (src) => {
      const relativePath = path.relative(templatePath, src);

      return (
        relativePath !== 'node_modules' &&
        relativePath !== 'package-lock.json' &&
        relativePath !== '.git'
      );
    },
  });
}