import { bold, cyan, dim } from './colors.js';

import { getVersion } from './version.js';

export async function showHelp() {
  const version = await getVersion();

  console.log(`
${bold('create-app')} ${dim(`v${version}`)}

Create a new Expo application from the BugCode Studio starter kit.

${cyan('Usage:')}
  create-app <app-name> [options]
  create-app doctor

${cyan('Commands:')}
  doctor         Check your environment for required tools

${cyan('Options:')}
  --npm          Use npm
  --yarn         Use yarn
  --pnpm         Use pnpm
  --bun          Use bun

  --no-install   Skip dependency installation
  --no-git       Skip Git initialization

  --version, -v  Show the CLI version
  --help, -h     Show this help message

${cyan('Examples:')}
  create-app MyApp
  create-app MyApp --yarn
  create-app MyApp --pnpm --no-git
  create-app doctor
`);
}