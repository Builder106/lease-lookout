import type { PhotoInput } from '@/lib/walkthrough/describe-photo';

export const MAX_SIDE = 1280;

/** Scale (w, h) down so the longer side is at most `max`, keeping the ratio. */
export function fitWithin(w: number, h: number, max: number = MAX_SIDE): [number, number] {
  const scale = Math.min(1, max / Math.max(w, h));
  return [Math.round(w * scale), Math.round(h * scale)];
}

export function bytesToBase64(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.length; i += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  }
  return btoa(binary);
}

/**
 * Re-encodes any camera photo (HEIC, WebP, huge JPEG) as a JPEG of at most
 * MAX_SIDE px, because the on-device model accepts only JPEG and PNG and a
 * smaller image is faster on both paths.
 */
export async function preparePhoto(file: Blob): Promise<{ photo: PhotoInput; blob: Blob }> {
  const bitmap = await createImageBitmap(file);
  const [w, h] = fitWithin(bitmap.width, bitmap.height);
  const canvas = new OffscreenCanvas(w, h);
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('This browser cannot process photos.');
  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close();
  const blob = await canvas.convertToBlob({ type: 'image/jpeg', quality: 0.85 });
  const base64 = bytesToBase64(new Uint8Array(await blob.arrayBuffer()));
  return { photo: { mimeType: 'image/jpeg', base64 }, blob };
}
