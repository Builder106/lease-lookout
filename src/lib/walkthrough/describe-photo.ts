import {
  getGenerativeModel,
  InferenceMode,
  type GenerativeModel,
  type InferenceSource,
  type LanguageModelCreateOptions,
} from 'firebase/ai';

import { firebaseAI } from '@/lib/firebase/client';

export const CONDITIONS = ['good', 'worn', 'damaged', 'missing'] as const;
export type Condition = (typeof CONDITIONS)[number];

export type Observation = { item: string; condition: Condition; detail: string };
export type PhotoDescription = { summary: string; observations: Observation[] };

export type PhotoInput = { mimeType: 'image/jpeg' | 'image/png'; base64: string };

export const DEFAULT_CLOUD_MODEL = 'gemini-3.5-flash-lite';

// One JSON Schema for both paths: Chrome's Prompt API takes it as a response
// constraint, and the cloud model takes it as responseJsonSchema.
export const PHOTO_SCHEMA = {
  type: 'object',
  properties: {
    summary: { type: 'string' },
    observations: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          item: { type: 'string' },
          condition: { type: 'string', enum: [...CONDITIONS] },
          detail: { type: 'string' },
        },
        required: ['item', 'condition', 'detail'],
      },
    },
  },
  required: ['summary', 'observations'],
};

// What the on-device session needs: English text plus one image in, English
// text out. The availability check asks about exactly this combination.
export const ON_DEVICE_OPTIONS: LanguageModelCreateOptions = {
  expectedInputs: [{ type: 'text', languages: ['en'] }, { type: 'image' }],
  expectedOutputs: [{ type: 'text', languages: ['en'] }],
};

// Kept in the prompt itself (not a system instruction) so the on-device and
// cloud paths receive exactly the same text.
const INSTRUCTIONS = `You help a renter record the condition of an apartment on move-in day, as evidence for getting a security deposit back.
Describe only what is visible in the photo. For each surface, fixture, or appliance you can see, give its condition (good, worn, damaged, or missing) and one short factual detail, such as the size and position of a stain, scuff, crack, or chip.
Do not guess what caused any damage, who is responsible, or what a repair costs. Do not give legal advice.
Write the summary as one plain sentence.`;

export function photoModel(
  mode: InferenceMode = InferenceMode.PREFER_ON_DEVICE,
  cloudModel: string = DEFAULT_CLOUD_MODEL
): GenerativeModel {
  return getGenerativeModel(firebaseAI(), {
    mode,
    onDeviceParams: {
      createOptions: ON_DEVICE_OPTIONS,
      promptOptions: { responseConstraint: PHOTO_SCHEMA },
    },
    inCloudParams: {
      model: cloudModel,
      generationConfig: { responseMimeType: 'application/json', responseJsonSchema: PHOTO_SCHEMA },
    },
  });
}

export function buildPrompt(room: string, note: string): string {
  const lines = [INSTRUCTIONS, `Room: ${room.trim() || 'not given'}`];
  if (note.trim()) lines.push(`Renter's note: ${note.trim()}`);
  return lines.join('\n\n');
}

/** Validates model JSON; drops malformed observations instead of trusting them. */
export function parseDescription(text: string): PhotoDescription {
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    throw new Error('The model did not return a readable description. Try the photo again.');
  }
  if (typeof raw !== 'object' || raw === null) {
    throw new Error('The model did not return a readable description. Try the photo again.');
  }
  const { summary, observations } = raw as { summary?: unknown; observations?: unknown };
  const valid = Array.isArray(observations)
    ? observations.filter(
        (o): o is Observation =>
          typeof o === 'object' &&
          o !== null &&
          typeof (o as Observation).item === 'string' &&
          typeof (o as Observation).detail === 'string' &&
          CONDITIONS.includes((o as Observation).condition)
      )
    : [];
  return {
    summary: typeof summary === 'string' ? summary.trim() : '',
    observations: valid.map(({ item, condition, detail }) => ({
      item: item.trim(),
      condition,
      detail: detail.trim(),
    })),
  };
}

export type DescribeResult = { description: PhotoDescription; source: InferenceSource | undefined };

export async function describePhoto(
  model: Pick<GenerativeModel, 'generateContent'>,
  photo: PhotoInput,
  room: string,
  note: string
): Promise<DescribeResult> {
  const result = await model.generateContent([
    { type: 'text', text: buildPrompt(room, note) },
    { type: 'inlineData', inlineData: { mimeType: photo.mimeType, data: photo.base64 } },
  ]);
  return {
    description: parseDescription(result.response.text()),
    source: result.response.inferenceSource,
  };
}
