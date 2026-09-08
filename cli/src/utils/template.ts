import path from 'node:path';
import fs from 'fs-extra';

export async function copyTemplate(
  templatePath: string,
  targetPath: string,
) {
  await fs.copy(templatePath, targetPath, {
    filter: (src) => {
      const relativePath = path.relative(
        templatePath,
        src,
      );

      const firstSegment = relativePath.split(
        path.sep,
      )[0];

      return ![
        'node_modules',
        '.git',
        'package-lock.json',
        'yarn.lock',
        'pnpm-lock.yaml',
        'bun.lock',
        'bun.lockb',
      ].includes(firstSegment);
    },
  });
}