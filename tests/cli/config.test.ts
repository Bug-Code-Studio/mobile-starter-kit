import fs from "fs-extra";
import os from "node:os";
import path from "node:path";

import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
} from "vitest";

import {
  configureAppConfig,
  configurePackageJson,
} from "../../cli/src/utils/config.js";

describe("config", () => {
  let tempDirectory: string;

  beforeEach(async () => {
    tempDirectory = await fs.mkdtemp(
      path.join(
        os.tmpdir(),
        "create-app-config-test-",
      ),
    );
  });

  afterEach(async () => {
    await fs.remove(tempDirectory);
  });

  it("configures package.json", async () => {
    const packageJsonPath = path.join(
      tempDirectory,
      "package.json",
    );

    await fs.writeJson(packageJsonPath, {
      name: "template-app",
      version: "1.0.0",
      private: true,
      scripts: {
        start: "expo start",
      },
    });

    await configurePackageJson(
      tempDirectory,
      {
        displayName: "My App",
        slug: "my-app",
        scheme: "myapp",
        packageName: "my-app",
        androidPackage:
          "com.bugcodestudio.myapp",
        iosBundleIdentifier:
          "com.bugcodestudio.myapp",
      },
    );

    const packageJson =
      await fs.readJson(
        packageJsonPath,
      );

    expect(packageJson.name).toBe(
      "my-app",
    );

    expect(packageJson.version).toBe(
      "1.0.0",
    );

    expect(packageJson.private).toBe(
      true,
    );

    expect(
      packageJson.scripts.start,
    ).toBe("expo start");
  });

  it("configures app.config.ts", async () => {
    const appConfigPath = path.join(
      tempDirectory,
      "app.config.ts",
    );

    await fs.writeFile(
      appConfigPath,
      `import type { ExpoConfig } from 'expo/config';

const config: ExpoConfig = {
  name: 'Template App',
  slug: 'template-app',
  scheme: 'template',
  version: '1.0.0',
  ios: {
    bundleIdentifier:
      'com.bugcodestudio.template',
  },
  android: {
    package:
      'com.bugcodestudio.template',
  },
};

export default config;
`,
      "utf8",
    );

    await configureAppConfig(
      tempDirectory,
      {
        displayName: "My App",
        slug: "my-app",
        scheme: "myapp",
        packageName: "my-app",
        androidPackage:
          "com.bugcodestudio.myapp",
        iosBundleIdentifier:
          "com.bugcodestudio.myapp",
      },
    );

    const appConfig =
      await fs.readFile(
        appConfigPath,
        "utf8",
      );

    expect(appConfig).toContain(
      "name: 'My App'",
    );

    expect(appConfig).toContain(
      "slug: 'my-app'",
    );

    expect(appConfig).toContain(
      "scheme: 'myapp'",
    );

    expect(appConfig).toContain(
      "version: '1.0.0'",
    );

    expect(appConfig).toContain(
      "bundleIdentifier: 'com.bugcodestudio.myapp'",
    );

    expect(appConfig).toContain(
      "package: 'com.bugcodestudio.myapp'",
    );
  });

  it("adds missing ios bundle identifier", async () => {
    const appConfigPath = path.join(
      tempDirectory,
      "app.config.ts",
    );

    await fs.writeFile(
      appConfigPath,
      `import type { ExpoConfig } from 'expo/config';

const config: ExpoConfig = {
  name: 'Template App',
  slug: 'template-app',
  ios: {
    supportsTablet: true,
  },
};

export default config;
`,
      "utf8",
    );

    await configureAppConfig(
      tempDirectory,
      {
        displayName: "My App",
        slug: "my-app",
        scheme: "myapp",
        packageName: "my-app",
        androidPackage:
          "com.bugcodestudio.myapp",
        iosBundleIdentifier:
          "com.bugcodestudio.myapp",
      },
    );

    const appConfig =
      await fs.readFile(
        appConfigPath,
        "utf8",
      );

    expect(appConfig).toContain(
      "supportsTablet: true",
    );

    expect(appConfig).toContain(
      "bundleIdentifier: 'com.bugcodestudio.myapp'",
    );
  });

  it("adds missing android package", async () => {
    const appConfigPath = path.join(
      tempDirectory,
      "app.config.ts",
    );

    await fs.writeFile(
      appConfigPath,
      `import type { ExpoConfig } from 'expo/config';

const config: ExpoConfig = {
  name: 'Template App',
  slug: 'template-app',
  android: {
    adaptiveIcon: {
      foregroundImage:
        './assets/icon.png',
    },
  },
};

export default config;
`,
      "utf8",
    );

    await configureAppConfig(
      tempDirectory,
      {
        displayName: "My App",
        slug: "my-app",
        scheme: "myapp",
        packageName: "my-app",
        androidPackage:
          "com.bugcodestudio.myapp",
        iosBundleIdentifier:
          "com.bugcodestudio.myapp",
      },
    );

    const appConfig =
      await fs.readFile(
        appConfigPath,
        "utf8",
    );

    expect(appConfig).toContain(
      "foregroundImage:\n        './assets/icon.png'",
    );

    expect(appConfig).toContain(
      "package: 'com.bugcodestudio.myapp'",
    );
  });
});