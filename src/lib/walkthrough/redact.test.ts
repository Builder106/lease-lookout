import { describe, expect, it } from 'vitest';

import { redactSensitiveText } from './redact';

describe('redactSensitiveText', () => {
  it('masks contacts, account details, and a street address', () => {
    expect(
      redactSensitiveText(
        'Email renter@example.com or (860) 555-1234. Account number 1234-5678. 12 Main Street.'
      )
    ).toEqual({
      text: 'Email [removed] or [removed]. [removed]. [removed].',
      replacements: 4,
    });
  });

  it('leaves ordinary deduction text unchanged', () => {
    expect(redactSensitiveText('Charge for a scuffed living-room wall.')).toEqual({
      text: 'Charge for a scuffed living-room wall.',
      replacements: 0,
    });
  });
});
