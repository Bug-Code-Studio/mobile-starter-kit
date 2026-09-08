# @bugcodestudio/create-app

Create production-ready React Native applications with Expo and TypeScript using the BugCode Studio Mobile Starter Kit.

`@bugcodestudio/create-app` provides a preconfigured mobile application foundation with navigation, authentication, UI components, state management, data fetching, form validation, deep linking, and a scalable feature-based architecture.

## Features

* Expo + TypeScript
* React Navigation
* Gluestack UI
* NativeWind
* Supabase
* TanStack Query
* Zustand
* React Hook Form
* Zod
* React Native Reanimated
* Feature-based architecture
* Onboarding flow
* Authentication flow
* Email OTP verification
* Password reset with OTP
* Bottom tab navigation
* Deep linking
* Environment configuration
* Automatic dependency installation
* Automatic Git initialization

## Requirements

Before creating a project, make sure you have:

* Node.js 20 or later
* npm, Yarn, pnpm, or Bun

## Create a New App

The recommended way to create a new project is with `npx`:

```bash
npx @bugcodestudio/create-app MyApp
```

The CLI will:

1. Create the project directory
2. Copy the starter template
3. Configure `package.json`
4. Configure Expo
5. Install dependencies
6. Initialize a Git repository
7. Create the initial Git commit

After the project is created:

```bash
cd MyApp
npx expo start
```

## Project Name

The project name is automatically converted into valid package, slug, and scheme names.

For example:

```bash
npx @bugcodestudio/create-app MyAwesomeApp
```

Generates:

```text
Display name: MyAwesomeApp
Package name: my-awesome-app
Slug: my-awesome-app
Scheme: myawesomeapp
```

Expo identifiers are also generated automatically:

```text
iOS:
com.bugcodestudio.myawesomeapp

Android:
com.bugcodestudio.myawesomeapp
```

## CLI Options

### Package Manager

The CLI automatically detects the package manager when possible.

You can also select one explicitly:

```bash
npx @bugcodestudio/create-app MyApp --npm
```

```bash
npx @bugcodestudio/create-app MyApp --yarn
```

```bash
npx @bugcodestudio/create-app MyApp --pnpm
```

```bash
npx @bugcodestudio/create-app MyApp --bun
```

Only one package manager can be selected at a time.

### Skip Dependency Installation

Use `--no-install` if you want to install dependencies manually:

```bash
npx @bugcodestudio/create-app MyApp --no-install
```

You can then install dependencies yourself:

```bash
cd MyApp
npm install
```

### Skip Git Initialization

Use `--no-git` if you do not want the CLI to initialize a Git repository:

```bash
npx @bugcodestudio/create-app MyApp --no-git
```

### Skip Both

You can combine options:

```bash
npx @bugcodestudio/create-app MyApp --no-install --no-git
```

### Help

Display available commands and options:

```bash
npx @bugcodestudio/create-app --help
```

or:

```bash
npx @bugcodestudio/create-app -h
```

## Generated Project

The generated application includes a scalable feature-based architecture:

```text
src/
├── app/
│   └── navigation/
│
├── components/
│   ├── ui/
│   └── app/
│
├── features/
│   ├── onboarding/
│   ├── auth/
│   └── home/
│
├── lib/
│   ├── supabase/
│   └── query/
│
├── providers/
│
├── stores/
│
├── types/
│
└── utils/
```

### Architecture

The starter kit follows clear responsibilities for application state:

| Responsibility      | Technology       |
| ------------------- | ---------------- |
| Server state        | TanStack Query   |
| Client/global state | Zustand          |
| Form state          | React Hook Form  |
| Validation          | Zod              |
| Navigation          | React Navigation |
| Authentication      | Supabase Auth    |
| UI                  | Gluestack UI     |
| Styling             | NativeWind       |
| Animation           | Reanimated       |
| Backend             | Supabase         |

## Authentication

The generated application includes a complete authentication foundation:

```text
Authentication
├── Login
├── Register
├── Forgot Password
├── Account Verification
└── Reset Password
```

### Email Verification

Registration uses an email OTP verification flow:

```text
Register
   ↓
Send OTP
   ↓
Account Verification
   ↓
Authenticated
   ↓
Main App
```

### Password Reset

Password recovery uses a separate OTP flow:

```text
Forgot Password
   ↓
Send OTP
   ↓
Account Verification
   ↓
Reset Password
   ↓
Login
```

## Navigation

The application uses React Navigation with a root navigation structure:

```text
Root Navigator
├── Onboarding
├── Auth
│   ├── Login
│   ├── Register
│   ├── Forgot Password
│   ├── Account Verification
│   └── Reset Password
│
└── Main
    └── Bottom Tabs
        └── Home
```

## Deep Linking

Deep linking is configured out of the box using the `starterkit://` scheme.

Example routes:

```text
starterkit://onboarding
starterkit://auth/login
starterkit://auth/register
starterkit://auth/forgot-password
starterkit://auth/verify
starterkit://auth/reset-password
starterkit://home
```

The generated application can customize the scheme through its Expo configuration.

## Environment Variables

Supabase configuration is provided through environment variables.

Create a local `.env` file in your generated application:

```env
EXPO_PUBLIC_SUPABASE_URL=your-supabase-url
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key
```

Do not commit environment files containing credentials or secrets.

## Development

This repository contains both the CLI and the application template.

```text
mobile-starter-kit/
├── cli/
│   └── CLI package
│
├── template/
│   └── Expo application template
│
└── tests/
    └── CLI tests
```

### Install Dependencies

From the repository root:

```bash
npm install
```

### Build the CLI

```bash
npm run cli:build
```

### Run CLI in Development

```bash
npm run cli:dev -- MyApp --no-install --no-git
```

### Run Tests

```bash
npm run cli:test
```

## Local Package Testing

To test the npm package locally before publishing:

```bash
cd cli
npm pack
```

This creates a package tarball:

```text
bugcodestudio-create-app-0.1.0.tgz
```

You can then execute the package locally:

```bash
npx /absolute/path/to/bugcodestudio-create-app-0.1.0.tgz TestApp --no-install --no-git
```

This allows the packaged CLI and bundled template to be tested before publishing to npm.

## Publishing

The CLI package is published as:

```text
@bugcodestudio/create-app
```

To create a production package:

```bash
cd cli
npm pack
```

To publish:

```bash
npm publish --access public
```

After publishing, users can create applications directly through npm:

```bash
npx @bugcodestudio/create-app MyApp
```

## License

MIT © BugCode Studio
