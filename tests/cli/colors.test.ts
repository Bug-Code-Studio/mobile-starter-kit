import { afterEach, describe, expect, it } from 'vitest';

import { colorize, useColor } from '../../cli/src/utils/colors.js';

describe('colors', () => {
  const originalNoColor = process.env.NO_COLOR;
  const originalForceColor = process.env.FORCE_COLOR;

  afterEach(() => {
    if (originalNoColor === undefined) {
      delete process.env.NO_COLOR;
    } else {
      process.env.NO_COLOR = originalNoColor;
    }

    if (originalForceColor === undefined) {
      delete process.env.FORCE_COLOR;
    } else {
      process.env.FORCE_COLOR = originalForceColor;
    }
  });

  it('returns the raw message when NO_COLOR is set', () => {
    process.env.NO_COLOR = '1';
    delete process.env.FORCE_COLOR;

    expect(useColor()).toBe(false);
    expect(colorize('red', 'hello')).toBe('hello');
  });

  it('wraps the message in ANSI codes when color is forced', () => {
    delete process.env.NO_COLOR;
    process.env.FORCE_COLOR = '1';

    expect(useColor()).toBe(true);
    expect(colorize('green', 'hello')).toBe('\u001b[32mhello\u001b[0m');
  });

  it('prioritizes NO_COLOR over FORCE_COLOR', () => {
    process.env.NO_COLOR = '1';
    process.env.FORCE_COLOR = '1';

    expect(useColor()).toBe(false);
  });
});
