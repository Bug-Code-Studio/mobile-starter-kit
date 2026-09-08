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

import { createProject } from "../../cli/src/commands/create.js";

const tempDirectories: string[] = [];

describe("createProject", () => {
  let tempDirectory: string;
  let targetPath: string;
  let templatePath: string;

  beforeEach(async () => {
    tempDirectory = await fs.mkdtemp(
      path.join(
        os.tmpdir(),
        "create-app-test-",
      ),
    );

    tempDirectories.push(tempDirectory);

    templatePath = path.join(
      tempDirectory,
      "template",
    );

    targetPath = path.join(
      tempDirectory,
      "MyApp",
    );

    await fs.ensureDir(templatePath);

    await fs.writeJson(
      path.join(
        templatePath,
        "package.json",
      ),
      {
        name: "template-app",
        version: "1.0.0",
      },
    );

    await fs.writeFile(
      path.join(
        templatePath,
        "app.config.ts",
      ),
      `import type { ExpoConfig } from 'expo/config';

const config: ExpoConfig = {
  name: 'Template',
  slug: 'template',
  scheme: 'template',
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
  });

  afterEach(async () => {
    await Promise.all(
      tempDirectories.map((directory) =>
        fs.remove(directory),
      ),
    );

    tempDirectories.length = 0;
  });

  it("creates a project from the template", async () => {
    await createProject(
      {
        displayName: "MyApp",
        slug: "myapp",
        packageName: "myapp",
        scheme: "myapp",
        iosBundleIdentifier:
          "com.bugcodestudio.myapp",
        androidPackage:
          "com.bugcodestudio.myapp",
      },
      templatePath,
      targetPath,
      "npm",
      {
        install: false,
        git: false,
      },
    );

    expect(
      await fs.pathExists(targetPath),
    ).toBe(true);

    expect(
      await fs.pathExists(
        path.join(
          targetPath,
          "package.json",
        ),
      ),
    ).toBe(true);

    expect(
      await fs.pathExists(
        path.join(
          targetPath,
          "app.config.ts",
        ),
      ),
    ).toBe(true);
  });

  it("configures package.json", async () => {
    await createProject(
      {
        displayName: "My App",
        slug: "my-app",
        packageName: "my-app",
        scheme: "myapp",
        iosBundleIdentifier:
          "com.bugcodestudio.myapp",
        androidPackage:
          "com.bugcodestudio.myapp",
      },
      templatePath,
      targetPath,
      "npm",
      {
        install: false,
        git: false,
      },
    );

    const packageJson =
      await fs.readJson(
        path.join(
          targetPath,
          "package.json",
        ),
      );

    expect(packageJson.name).toBe(
      "my-app",
    );
  });

  it("configures app.config.ts", async () => {
    await createProject(
      {
        displayName: "My App",
        slug: "my-app",
        packageName: "my-app",
        scheme: "myapp",
        iosBundleIdentifier:
          "com.bugcodestudio.myapp",
        androidPackage:
          "com.bugcodestudio.myapp",
      },
      templatePath,
      targetPath,
      "npm",
      {
        install: false,
        git: false,
      },
    );

    const appConfig =
      await fs.readFile(
        path.join(
          targetPath,
          "app.config.ts",
        ),
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
      "bundleIdentifier: 'com.bugcodestudio.myapp'",
    );

    expect(appConfig).toContain(
      "package: 'com.bugcodestudio.myapp'",
    );
  });

  it("does not install dependencies when install is disabled", async () => {
    await createProject(
      {
        displayName: "MyApp",
        slug: "myapp",
        packageName: "myapp",
        scheme: "myapp",
        iosBundleIdentifier:
          "com.bugcodestudio.myapp",
        androidPackage:
          "com.bugcodestudio.myapp",
      },
      templatePath,
      targetPath,
      "npm",
      {
        install: false,
        git: false,
      },
    );

    expect(
      await fs.pathExists(
        path.join(
          targetPath,
          "node_modules",
        ),
      ),
    ).toBe(false);
  });

  it("does not initialize git when git is disabled", async () => {
    await createProject(
      {
        displayName: "MyApp",
        slug: "myapp",
        packageName: "myapp",
        scheme: "myapp",
        iosBundleIdentifier:
          "com.bugcodestudio.myapp",
        androidPackage:
          "com.bugcodestudio.myapp",
      },
      templatePath,
      targetPath,
      "npm",
      {
        install: false,
        git: false,
      },
    );

    expect(
      await fs.pathExists(
        path.join(
          targetPath,
          ".git",
        ),
      ),
    ).toBe(false);
  });
});