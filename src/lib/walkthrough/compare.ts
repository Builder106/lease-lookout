import {
  getGenerativeModel,
  InferenceMode,
  type GenerativeModel,
  type InferenceSource,
} from 'firebase/ai';

import { firebaseAI } from '@/lib/firebase/client';
import type { PhotoDescription } from '@/lib/walkthrough/describe-photo';
import type { RoomId } from '@/lib/walkthrough/rooms';

export type Evidence = {
  room: RoomId;
  takenAt: string;
  description: PhotoDescription;
};

export const FINDINGS = ['already_there', 'not_recorded', 'unclear'] as const;
export type Finding = (typeof FINDINGS)[number];
export type ChargeMatch = { charge: string; finding: Finding; evidence: string };
export type Comparison = { matches: ChargeMatch[] };

const COMPARISON_SCHEMA = {
  type: 'object',
  properties: {
    matches: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          charge: { type: 'string' },
          finding: { type: 'string', enum: [...FINDINGS] },
          evidence: { type: 'string' },
        },
        required: ['charge', 'finding', 'evidence'],
      },
    },
  },
  required: ['matches'],
};

const INSTRUCTIONS = `You compare a landlord's deduction letter with a renter's move-in condition record.
Use only the record provided. For every distinct charge in the letter, return one result.
Use already_there only when the record directly describes the same condition in the same room. Use not_recorded only when the relevant room was photographed but the claimed condition is absent. Use unclear for every other case.
The evidence field must say which dated record supports the finding. Do not decide legal responsibility, interpret a statute, estimate a cost, or give legal advice.`;

export function evidenceText(entries: Evidence[]): string {
  return entries
    .map((entry) => {
      const observations = entry.description.observations
        .map((observation) => `${observation.item}: ${observation.condition}. ${observation.detail}`)
        .join(' ');
      return `${entry.room}, ${entry.takenAt}: ${entry.description.summary} ${observations}`.trim();
    })
    .join('\n');
}

export function buildComparisonPrompt(letter: string, entries: Evidence[]): string {
  return `${INSTRUCTIONS}\n\nCleaned deduction letter:\n${letter.trim()}\n\nMove-in condition record:\n${evidenceText(entries)}`;
}

export function comparisonModel(cloudModel = 'gemini-3.5-flash-lite'): GenerativeModel {
  return getGenerativeModel(firebaseAI(), {
    mode: InferenceMode.ONLY_IN_CLOUD,
    inCloudParams: {
      model: cloudModel,
      generationConfig: {
        responseMimeType: 'application/json',
        responseJsonSchema: COMPARISON_SCHEMA,
      },
    },
  });
}

export function parseComparison(text: string): Comparison {
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    throw new Error('The comparison did not return readable results. Try again.');
  }
  if (typeof raw !== 'object' || raw === null || !Array.isArray((raw as { matches?: unknown }).matches)) {
    throw new Error('The comparison did not return readable results. Try again.');
  }
  const matches = (raw as { matches: unknown[] }).matches.filter(
    (match): match is ChargeMatch =>
      typeof match === 'object' &&
      match !== null &&
      typeof (match as ChargeMatch).charge === 'string' &&
      typeof (match as ChargeMatch).evidence === 'string' &&
      FINDINGS.includes((match as ChargeMatch).finding)
  );
  return {
    matches: matches.map(({ charge, finding, evidence }) => ({
      charge: charge.trim(),
      finding,
      evidence: evidence.trim(),
    })),
  };
}

export async function compareDeductions(
  model: Pick<GenerativeModel, 'generateContent'>,
  letter: string,
  entries: Evidence[]
): Promise<{ comparison: Comparison; source: InferenceSource | undefined }> {
  const result = await model.generateContent(buildComparisonPrompt(letter, entries));
  return { comparison: parseComparison(result.response.text()), source: result.response.inferenceSource };
}
