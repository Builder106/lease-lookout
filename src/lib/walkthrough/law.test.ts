import { describe, expect, it } from 'vitest';

import { ROOMS } from './rooms';
import {
  citation,
  DEPOSIT_STATES,
  formatDollars,
  parseAmount,
  returnDeadline,
  roomLaw,
  type StateCode,
} from './law';

describe('law lines', () => {
  it('cites a curated rule for every room in every state', () => {
    for (const state of Object.keys(DEPOSIT_STATES) as StateCode[])
      for (const room of ROOMS) {
        const { text, cite } = roomLaw(state, room.id);
        expect(text).not.toMatch(/[—–]/);
        expect(cite.label).toMatch(/§/);
        expect(cite.url).toMatch(/^https:\/\//);
      }
  });

  it('reads the deadline citation from the ruleset', () => {
    expect(returnDeadline('ct')).toMatchObject({
      days: 21,
      cite: { label: 'Conn. Gen. Stat. § 47a-21(d)' },
    });
    expect(returnDeadline('ma')).toMatchObject({
      days: 30,
      cite: { label: 'M.G.L. c. 186, § 15B(4)' },
    });
  });

  it('refuses a rule the ruleset does not have', () => {
    expect(() => citation('ct-made-up-001')).toThrow(/No curated citation/);
  });

  it('parses and formats deposit amounts', () => {
    expect(parseAmount('$1,450')).toBe(1450);
    expect(parseAmount(' 1450.60 ')).toBe(1451);
    expect(parseAmount('')).toBeNull();
    expect(parseAmount('-5')).toBeNull();
    expect(parseAmount('abc')).toBeNull();
    expect(formatDollars(1450)).toBe('$1,450');
  });
});
