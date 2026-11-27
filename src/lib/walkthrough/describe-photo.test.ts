import { describe, expect, it, vi } from 'vitest';

const m = vi.hoisted(() => ({
  getGenerativeModel: vi.fn(() => ({ model: true })),
  firebaseAI: vi.fn(() => ({ ai: true })),
}));

vi.mock('firebase/ai', () => ({
  getGenerativeModel: m.getGenerativeModel,
  InferenceMode: {
    PREFER_ON_DEVICE: 'prefer_on_device',
    ONLY_ON_DEVICE: 'only_on_device',
    ONLY_IN_CLOUD: 'only_in_cloud',
    PREFER_IN_CLOUD: 'prefer_in_cloud',
  },
}));
vi.mock('@/lib/firebase/client', () => ({ firebaseAI: m.firebaseAI }));

import {
  buildPrompt,
  DEFAULT_CLOUD_MODEL,
  describePhoto,
  parseDescription,
  PHOTO_SCHEMA,
  photoModel,
} from './describe-photo';

describe('photoModel', () => {
  it('prefers the device and sends the same schema to both paths by default', () => {
    photoModel();
    expect(m.getGenerativeModel).toHaveBeenLastCalledWith(
      { ai: true },
      expect.objectContaining({
        mode: 'prefer_on_device',
        onDeviceParams: expect.objectContaining({
          promptOptions: { responseConstraint: PHOTO_SCHEMA },
        }),
        inCloudParams: {
          model: DEFAULT_CLOUD_MODEL,
          generationConfig: {
            responseMimeType: 'application/json',
            responseJsonSchema: PHOTO_SCHEMA,
          },
        },
      })
    );
  });

  it('accepts a mode and cloud model from configuration', () => {
    photoModel('only_in_cloud', 'gemini-test');
    expect(m.getGenerativeModel).toHaveBeenLastCalledWith(
      { ai: true },
      expect.objectContaining({
        mode: 'only_in_cloud',
        inCloudParams: expect.objectContaining({ model: 'gemini-test' }),
      })
    );
  });
});

describe('buildPrompt', () => {
  it('includes the room and the note', () => {
    const prompt = buildPrompt(' Kitchen ', ' burn mark ');
    expect(prompt).toContain('Room: Kitchen');
    expect(prompt).toContain("Renter's note: burn mark");
    expect(prompt).toContain('Do not give legal advice.');
  });

  it('marks a missing room and leaves out an empty note', () => {
    const prompt = buildPrompt('  ', ' ');
    expect(prompt).toContain('Room: not given');
    expect(prompt).not.toContain("Renter's note");
  });
});

describe('parseDescription', () => {
  it('keeps valid observations and trims text', () => {
    const text = JSON.stringify({
      summary: ' Clean kitchen with one chipped tile. ',
      observations: [
        { item: ' Floor tile ', condition: 'damaged', detail: ' 2 cm chip by the fridge ' },
      ],
    });
    expect(parseDescription(text)).toEqual({
      summary: 'Clean kitchen with one chipped tile.',
      observations: [
        { item: 'Floor tile', condition: 'damaged', detail: '2 cm chip by the fridge' },
      ],
    });
  });

  it('drops malformed observations', () => {
    const text = JSON.stringify({
      summary: 'Bedroom.',
      observations: [
        null,
        'a wall',
        { item: 1, condition: 'good', detail: 'x' },
        { item: 'Wall', condition: 'good', detail: 2 },
        { item: 'Wall', condition: 'broken', detail: 'x' },
        { item: 'Window', condition: 'worn', detail: 'Faded paint on the sill' },
      ],
    });
    expect(parseDescription(text).observations).toEqual([
      { item: 'Window', condition: 'worn', detail: 'Faded paint on the sill' },
    ]);
  });

  it('tolerates a missing summary and a non-array list', () => {
    expect(parseDescription(JSON.stringify({ summary: 3, observations: 'none' }))).toEqual({
      summary: '',
      observations: [],
    });
  });

  it('rejects text that is not JSON or not an object', () => {
    expect(() => parseDescription('not json')).toThrow(/readable description/);
    expect(() => parseDescription('null')).toThrow(/readable description/);
    expect(() => parseDescription('42')).toThrow(/readable description/);
  });
});

describe('describePhoto', () => {
  it('sends the prompt and image and reports where inference ran', async () => {
    const generateContent = vi.fn().mockResolvedValue({
      response: {
        text: () => JSON.stringify({ summary: 'Bathroom.', observations: [] }),
        inferenceSource: 'on_device',
      },
    });

    const result = await describePhoto(
      { generateContent },
      { mimeType: 'image/jpeg', base64: 'AAAA' },
      'Bathroom',
      ''
    );

    expect(generateContent).toHaveBeenCalledWith([
      { type: 'text', text: buildPrompt('Bathroom', '') },
      { type: 'inlineData', inlineData: { mimeType: 'image/jpeg', data: 'AAAA' } },
    ]);
    expect(result).toEqual({
      description: { summary: 'Bathroom.', observations: [] },
      source: 'on_device',
    });
  });
});
