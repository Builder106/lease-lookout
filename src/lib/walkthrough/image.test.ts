import { afterEach, describe, expect, it, vi } from 'vitest';

import { bytesToBase64, fitWithin, MAX_SIDE, preparePhoto } from './image';

describe('fitWithin', () => {
  it('scales the longer side down to the limit', () => {
    expect(fitWithin(4032, 3024)).toEqual([MAX_SIDE, 960]);
    expect(fitWithin(3024, 4032, 1000)).toEqual([750, 1000]);
  });

  it('never scales a small image up', () => {
    expect(fitWithin(800, 600)).toEqual([800, 600]);
  });
});

describe('bytesToBase64', () => {
  it('encodes small input', () => {
    expect(bytesToBase64(new TextEncoder().encode('hello'))).toBe('aGVsbG8=');
  });

  it('encodes input larger than one chunk', () => {
    const bytes = new Uint8Array(0x8000 * 2 + 3).fill(65);
    expect(bytesToBase64(bytes)).toBe(Buffer.from(bytes).toString('base64'));
  });
});

describe('preparePhoto', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  function stubCanvas(ctx: object | null) {
    const close = vi.fn();
    vi.stubGlobal(
      'createImageBitmap',
      vi.fn().mockResolvedValue({ width: 2560, height: 1920, close })
    );
    const drawImage = vi.fn();
    const convertToBlob = vi.fn().mockResolvedValue(new Blob([new Uint8Array([1, 2, 3])]));
    const sizes: number[][] = [];
    vi.stubGlobal(
      'OffscreenCanvas',
      vi.fn(function (this: object, w: number, h: number) {
        sizes.push([w, h]);
        Object.assign(this, {
          getContext: () => (ctx ? { ...ctx, drawImage } : null),
          convertToBlob,
        });
      })
    );
    return { close, drawImage, convertToBlob, sizes };
  }

  it('re-encodes the photo as a downscaled JPEG', async () => {
    const { close, drawImage, convertToBlob, sizes } = stubCanvas({});

    const { photo, blob } = await preparePhoto(new Blob(['heic']));

    expect(sizes).toEqual([[1280, 960]]);
    expect(drawImage).toHaveBeenCalledWith(expect.anything(), 0, 0, 1280, 960);
    expect(close).toHaveBeenCalled();
    expect(convertToBlob).toHaveBeenCalledWith({ type: 'image/jpeg', quality: 0.85 });
    expect(photo).toEqual({ mimeType: 'image/jpeg', base64: 'AQID' });
    expect(blob.size).toBe(3);
  });

  it('fails clearly when the browser has no 2D canvas', async () => {
    stubCanvas(null);
    await expect(preparePhoto(new Blob(['x']))).rejects.toThrow(/cannot process photos/);
  });
});
