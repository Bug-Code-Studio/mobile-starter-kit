export function showHelp() {
  console.log(`
create-app

Create a new Expo application from the BugCode Studio starter kit.

Usage:
  create-app <app-name> [options]

Options:
  --npm          Use npm
  --yarn         Use yarn
  --pnpm         Use pnpm
  --bun          Use bun

  --no-install   Skip dependency installation
  --no-git       Skip Git initialization

  --help         Show this help message

Examples:
  create-app MyApp
  create-app MyApp --yarn
  create-app MyApp --pnpm --no-git
`);
}