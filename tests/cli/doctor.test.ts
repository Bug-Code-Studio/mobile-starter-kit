import { describe, expect, it } from 'vitest';

import {
  evaluateChecks,
  parseMajorVersion,
  type CheckResult,
} from '../../cli/src/commands/doctor.js';

describe('parseMajorVersion', () => {
  it('extracts the major version from a semver string', () => {
    expect(parseMajorVersion('20.11.1')).toBe(20);
    expect(parseMajorVersion('v18.0.0')).toBe(18);
  });

  it('returns null for unparseable input', () => {
    expect(parseMajorVersion('not-a-version')).toBeNull();
  });
});

describe('evaluateChecks', () => {
  it('reports ok when there are no failures', () => {
    const results: CheckResult[] = [
      { name: 'Node.js', status: 'pass', detail: 'v20.0.0' },
      { name: 'Watchman', status: 'warn', detail: 'not found' },
    ];

    const evaluation = evaluateChecks(results);

    expect(evaluation.ok).toBe(true);
    expect(evaluation.failures).toHaveLength(0);
    expect(evaluation.warnings).toHaveLength(1);
  });

  it('reports failures and marks the result not ok', () => {
    const results: CheckResult[] = [
      { name: 'Node.js', status: 'fail', detail: 'too old' },
      { name: 'Git', status: 'pass', detail: 'v2.0.0' },
    ];

    const evaluation = evaluateChecks(results);

    expect(evaluation.ok).toBe(false);
    expect(evaluation.failures).toHaveLength(1);
    expect(evaluation.failures[0].name).toBe('Node.js');
  });
});
