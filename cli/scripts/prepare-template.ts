import fs from 'fs-extra';
import path from 'node:path';

const cliRoot = path.resolve(
  import.meta.dirname,
  '..',
);

const projectRoot = path.resolve(
  cliRoot,
  '..',
);

const sourceTemplate = path.join(
  projectRoot,
  'template',
);

const targetTemplate = path.join(
  cliRoot,
  'template',
);

await fs.remove(targetTemplate);

await fs.copy(
  sourceTemplate,
  targetTemplate,
  {
    filter: (src) => {
      const relativePath = path.relative(
        sourceTemplate,
        src,
      );

      const firstSegment =
        relativePath.split(path.sep)[0];

      return ![
        'node_modules',
        '.git',
        '.env',
        '.env.example',
        'package-lock.json',
        'yarn.lock',
        'pnpm-lock.yaml',
        'bun.lock',
        'bun.lockb',
      ].includes(firstSegment);
    },
  },
);

console.log('Template prepared for npm package.');