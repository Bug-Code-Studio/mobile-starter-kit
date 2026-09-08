import fs from 'fs-extra';
import os from 'node:os';
import path from 'node:path';

import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
} from 'vitest';

import {
  configureAppJson,
  configurePackageJson,
} from '../../cli/src/utils/config.js';

describe('config', () => {
  let tempDirectory: string;

  beforeEach(async () => {
    tempDirectory = await fs.mkdtemp(
      path.join(
        os.tmpdir(),
        'create-app-config-test-',
      ),
    );
  });

  afterEach(async () => {
    await fs.remove(tempDirectory);
  });

  it('configures package.json', async () => {
    const packageJsonPath = path.join(
      tempDirectory,
      'package.json',
    );

    await fs.writeJson(
      packageJsonPath,
      {
        name: 'template-app',
        version: '1.0.0',
        private: true,
        scripts: {
          start: 'expo start',
        },
      },
    );

    await configurePackageJson(
      tempDirectory,
      {
        displayName: 'My App',
        slug: 'my-app',
        packageName: 'my-app',
        scheme: 'myapp',
      },
    );

    const packageJson =
      await fs.readJson(
        packageJsonPath,
      );

    expect(
      packageJson.name,
    ).toBe('my-app');

    expect(
      packageJson.version,
    ).toBe('1.0.0');

    expect(
      packageJson.private,
    ).toBe(true);

    expect(
      packageJson.scripts.start,
    ).toBe('expo start');
  });

  it('configures app.json', async () => {
    const appJsonPath = path.join(
      tempDirectory,
      'app.json',
    );

    await fs.writeJson(
      appJsonPath,
      {
        expo: {
          name: 'Template App',
          slug: 'template-app',
          version: '1.0.0',
        },
      },
    );

    await configureAppJson(
      tempDirectory,
      {
        displayName: 'My App',
        slug: 'my-app',
        packageName: 'my-app',
        scheme: 'myapp',
      },
    );

    const appJson =
      await fs.readJson(
        appJsonPath,
      );

    expect(
      appJson.expo.name,
    ).toBe('My App');

    expect(
      appJson.expo.slug,
    ).toBe('my-app');

    expect(
      appJson.expo.scheme,
    ).toBe('myapp');

    expect(
      appJson.expo.version,
    ).toBe('1.0.0');

    expect(
      appJson.expo.ios.bundleIdentifier,
    ).toBe(
      'com.bugcodestudio.myapp',
    );

    expect(
      appJson.expo.android.package,
    ).toBe(
      'com.bugcodestudio.myapp',
    );
  });

  it('preserves existing ios configuration', async () => {
    const appJsonPath = path.join(
      tempDirectory,
      'app.json',
    );

    await fs.writeJson(
      appJsonPath,
      {
        expo: {
          name: 'Template App',
          slug: 'template-app',
          ios: {
            supportsTablet: true,
          },
        },
      },
    );

    await configureAppJson(
      tempDirectory,
      {
        displayName: 'My App',
        slug: 'my-app',
        packageName: 'my-app',
        scheme: 'myapp',
      },
    );

    const appJson =
      await fs.readJson(
        appJsonPath,
      );

    expect(
      appJson.expo.ios.supportsTablet,
    ).toBe(true);

    expect(
      appJson.expo.ios.bundleIdentifier,
    ).toBe(
      'com.bugcodestudio.myapp',
    );
  });

  it('preserves existing android configuration', async () => {
    const appJsonPath = path.join(
      tempDirectory,
      'app.json',
    );

    await fs.writeJson(
      appJsonPath,
      {
        expo: {
          name: 'Template App',
          slug: 'template-app',
          android: {
            adaptiveIcon: {
              foregroundImage:
                './assets/icon.png',
            },
          },
        },
      },
    );

    await configureAppJson(
      tempDirectory,
      {
        displayName: 'My App',
        slug: 'my-app',
        packageName: 'my-app',
        scheme: 'myapp',
      },
    );

    const appJson =
      await fs.readJson(
        appJsonPath,
      );

    expect(
      appJson.expo.android.adaptiveIcon
        .foregroundImage,
    ).toBe(
      './assets/icon.png',
    );

    expect(
      appJson.expo.android.package,
    ).toBe(
      'com.bugcodestudio.myapp',
    );
  });
});