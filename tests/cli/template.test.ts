import fs from 'fs-extra';
import os from 'node:fs/promises';
import nodePath from 'node:path';

import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
} from 'vitest';

import { copyTemplate } from '../../cli/src/utils/template.js';

describe('template', () => {
  let tempDirectory: string;
  let templatePath: string;
  let targetPath: string;

  beforeEach(async () => {
    tempDirectory =
      await fs.mkdtemp(
        nodePath.join(
          process.cwd(),
          '.tmp-template-test-',
        ),
      );

    templatePath = nodePath.join(
      tempDirectory,
      'template',
    );

    targetPath = nodePath.join(
      tempDirectory,
      'output',
    );

    await fs.ensureDir(templatePath);

    await fs.writeFile(
      nodePath.join(
        templatePath,
        'App.tsx',
      ),
      'export default function App() {}',
    );

    await fs.writeFile(
      nodePath.join(
        templatePath,
        'package.json',
      ),
      JSON.stringify({
        name: 'template-app',
      }),
    );

    await fs.ensureDir(
      nodePath.join(
        templatePath,
        'src',
      ),
    );

    await fs.writeFile(
      nodePath.join(
        templatePath,
        'src',
        'example.ts',
      ),
      'export const example = true;',
    );

    await fs.ensureDir(
      nodePath.join(
        templatePath,
        'node_modules',
      ),
    );

    await fs.writeFile(
      nodePath.join(
        templatePath,
        'node_modules',
        'should-not-copy.txt',
      ),
      'do not copy',
    );

    await fs.ensureDir(
      nodePath.join(
        templatePath,
        '.git',
      ),
    );

    await fs.writeFile(
      nodePath.join(
        templatePath,
        '.git',
        'config',
      ),
      'do not copy',
    );

    await fs.writeFile(
      nodePath.join(
        templatePath,
        'package-lock.json',
      ),
      '{}',
    );

    await fs.writeFile(
      nodePath.join(
        templatePath,
        'yarn.lock',
      ),
      '',
    );

    await fs.writeFile(
      nodePath.join(
        templatePath,
        'pnpm-lock.yaml',
      ),
      '',
    );

    await fs.writeFile(
      nodePath.join(
        templatePath,
        'bun.lock',
      ),
      '',
    );

    await fs.writeFile(
      nodePath.join(
        templatePath,
        'bun.lockb',
      ),
      '',
    );
  });

  afterEach(async () => {
    await fs.rm(
      tempDirectory,
      {
        recursive: true,
        force: true,
      },
    );
  });

  it('copies template files', async () => {
    await copyTemplate(
      templatePath,
      targetPath,
    );

    expect(
      await fs.pathExists(
        nodePath.join(
          targetPath,
          'App.tsx',
        ),
      ),
    ).toBe(true);

    expect(
      await fs.pathExists(
        nodePath.join(
          targetPath,
          'package.json',
        ),
      ),
    ).toBe(true);

    expect(
      await fs.pathExists(
        nodePath.join(
          targetPath,
          'src',
          'example.ts',
        ),
      ),
    ).toBe(true);
  });

  it('does not copy node_modules', async () => {
    await copyTemplate(
      templatePath,
      targetPath,
    );

    expect(
      await fs.pathExists(
        nodePath.join(
          targetPath,
          'node_modules',
        ),
      ),
    ).toBe(false);
  });

  it('does not copy .git', async () => {
    await copyTemplate(
      templatePath,
      targetPath,
    );

    expect(
      await fs.pathExists(
        nodePath.join(
          targetPath,
          '.git',
        ),
      ),
    ).toBe(false);
  });

  it('does not copy package manager lock files', async () => {
    await copyTemplate(
      templatePath,
      targetPath,
    );

    const lockFiles = [
      'package-lock.json',
      'yarn.lock',
      'pnpm-lock.yaml',
      'bun.lock',
      'bun.lockb',
    ];

    for (const lockFile of lockFiles) {
      expect(
        await fs.pathExists(
          nodePath.join(
            targetPath,
            lockFile,
          ),
        ),
      ).toBe(false);
    }
  });
});