import { describe, expect, it } from 'vitest';

import {
  createProjectNames,
  toPackageName,
  toScheme,
  toSlug,
  validateProjectName,
} from '../../cli/src/utils/names.js';

describe('names', () => {
  it('converts project name to slug', () => {
    expect(toSlug('My App')).toBe('my-app');
    expect(toSlug('My_App')).toBe('my-app');
  });

  it('creates package name', () => {
    expect(
      toPackageName('My App'),
    ).toBe('my-app');
  });

  it('creates scheme', () => {
    expect(
      toScheme('My App'),
    ).toBe('myapp');
  });

  it('creates project names', () => {
    expect(
      createProjectNames('My App'),
    ).toEqual({
      displayName: 'My App',
      slug: 'my-app',
      packageName: 'my-app',
      scheme: 'myapp',
    });
  });

  it('rejects missing project name', () => {
    expect(
      validateProjectName(undefined),
    ).toBe(
      'Project name is required.',
    );
  });

  it('rejects project names starting with a number', () => {
    expect(
      validateProjectName('123App'),
    ).toBe(
      'Project name cannot start with a number.',
    );
  });

  it('rejects project names without valid characters', () => {
    expect(
      validateProjectName('!!!'),
    ).toBe(
      'Project name contains no valid characters.',
    );
  });
});