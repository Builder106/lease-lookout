import { describe, expect, it } from 'vitest';
import { SUPPORTED_JURISDICTIONS, labelForJurisdiction } from './jurisdictions';

describe('jurisdictions utility', () => {
  it('SUPPORTED_JURISDICTIONS has all 7 New England & NY states', () => {
    const codes = SUPPORTED_JURISDICTIONS.map((j) => j.code);
    expect(codes).toEqual(['ct', 'me', 'ma', 'nh', 'ny', 'ri', 'vt']);
  });

  it('labelForJurisdiction returns expected human-readable label', () => {
    expect(labelForJurisdiction('ct')).toBe('Connecticut');
    expect(labelForJurisdiction('ma')).toBe('Massachusetts');
    expect(labelForJurisdiction('ny')).toBe('New York');
    expect(labelForJurisdiction('auto')).toBe('your state');
    expect(labelForJurisdiction(null)).toBe('your state');
    expect(labelForJurisdiction(undefined)).toBe('your state');
    expect(labelForJurisdiction('ca')).toBe('CA');
  });
});
