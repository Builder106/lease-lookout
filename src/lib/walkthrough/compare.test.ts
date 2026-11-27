import { describe, expect, it, vi } from 'vitest';

const m = vi.hoisted(() => ({
  getGenerativeModel: vi.fn(() => ({ model: true })),
  firebaseAI: vi.fn(() => ({ ai: true })),
}));

vi.mock('firebase/ai', () => ({
  getGenerativeModel: m.getGenerativeModel,
  InferenceMode: { ONLY_IN_CLOUD: 'only_in_cloud' },
}));
vi.mock('@/lib/firebase/client', () => ({ firebaseAI: m.firebaseAI }));

import {
  buildComparisonPrompt,
  compareDeductions,
  comparisonModel,
  evidenceText,
  parseComparison,
} from './compare';

const evidence = [
  {
    room: 'living' as const,
    takenAt: '2026-11-27T09:00:00.000Z',
    description: {
      summary: 'A scuffed wall is beside the window.',
      observations: [{ item: 'Wall', condition: 'worn' as const, detail: 'Scuffs beside window.' }],
    },
  },
];

describe('comparison model', () => {
  it('uses cloud-only structured inference', () => {
    comparisonModel('gemini-test');
    expect(m.getGenerativeModel).toHaveBeenCalledWith(
      { ai: true },
      expect.objectContaining({
        mode: 'only_in_cloud',
        inCloudParams: expect.objectContaining({ model: 'gemini-test' }),
      })
    );
  });
});

describe('comparison prompts', () => {
  it('includes only the cleaned letter and the condition record', () => {
    expect(evidenceText(evidence)).toContain('Wall: worn. Scuffs beside window.');
    expect(buildComparisonPrompt('Charge: scuffed wall.', evidence)).toContain(
      'Cleaned deduction letter:\nCharge: scuffed wall.'
    );
  });
});

describe('parseComparison', () => {
  it('keeps valid, trimmed matches', () => {
    expect(
      parseComparison(
        JSON.stringify({
          matches: [
            {
              charge: ' Scuffed wall ',
              finding: 'already_there',
              evidence: ' Living room photo, Nov 27 ',
            },
          ],
        })
      )
    ).toEqual({
      matches: [
        {
          charge: 'Scuffed wall',
          finding: 'already_there',
          evidence: 'Living room photo, Nov 27',
        },
      ],
    });
  });

  it('drops malformed matches and rejects malformed output', () => {
    expect(parseComparison(JSON.stringify({ matches: [{ charge: 1 }] }))).toEqual({ matches: [] });
    expect(() => parseComparison('bad json')).toThrow(/readable results/);
    expect(() => parseComparison(JSON.stringify({ matches: 'bad' }))).toThrow(/readable results/);
  });
});

describe('compareDeductions', () => {
  it('sends the prepared prompt and reports the cloud result', async () => {
    const generateContent = vi.fn().mockResolvedValue({
      response: {
        text: () => JSON.stringify({ matches: [] }),
        inferenceSource: 'in_cloud',
      },
    });
    await expect(compareDeductions({ generateContent }, 'Charge: scuffed wall.', evidence)).resolves.toEqual({
      comparison: { matches: [] },
      source: 'in_cloud',
    });
    expect(generateContent).toHaveBeenCalledWith(buildComparisonPrompt('Charge: scuffed wall.', evidence));
  });
});
