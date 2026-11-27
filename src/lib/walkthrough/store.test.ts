import 'fake-indexeddb/auto';

import { afterEach, describe, expect, it, vi } from 'vitest';

import { deleteEntry, loadEntries, saveEntry, type Entry } from './store';

const entry = (id: string, takenAt: string, status: Entry['status'] = 'done'): Entry => ({
  id,
  roomId: 'kitchen',
  note: '',
  takenAt,
  photo: { mimeType: 'image/jpeg', base64: 'AAAA' },
  status,
});

describe('walkthrough store', () => {
  afterEach(async () => {
    vi.restoreAllMocks();
    for (const e of await loadEntries()) await deleteEntry(e.id);
  });

  it('saves, loads oldest first, and deletes', async () => {
    await saveEntry(entry('b', '2026-11-27T10:00:00.000Z'));
    await saveEntry(entry('a', '2026-11-27T09:00:00.000Z'));
    expect((await loadEntries()).map((e) => e.id)).toEqual(['a', 'b']);

    await deleteEntry('a');
    expect((await loadEntries()).map((e) => e.id)).toEqual(['b']);
  });

  it('replaces an entry with the same id', async () => {
    await saveEntry(entry('a', '2026-11-27T09:00:00.000Z', 'waiting'));
    await saveEntry(entry('a', '2026-11-27T09:00:00.000Z', 'done'));
    expect(await loadEntries()).toHaveLength(1);
    expect((await loadEntries())[0].status).toBe('done');
  });

  it('turns an entry interrupted mid-description into one waiting to retry', async () => {
    await saveEntry(entry('a', '2026-11-27T09:00:00.000Z', 'describing'));
    expect((await loadEntries())[0].status).toBe('waiting');
  });

  it('rejects when the database cannot open', async () => {
    vi.spyOn(indexedDB, 'open').mockImplementation(() => {
      const req = {} as IDBOpenDBRequest;
      queueMicrotask(() => {
        Object.defineProperty(req, 'error', { value: new DOMException('blocked') });
        req.onerror?.(new Event('error'));
      });
      return req;
    });
    await expect(loadEntries()).rejects.toThrow('blocked');
  });

  it('rejects when a request fails', async () => {
    const put = vi.spyOn(IDBObjectStore.prototype, 'put').mockImplementation(() => {
      const req = {} as IDBRequest<IDBValidKey>;
      queueMicrotask(() => {
        Object.defineProperty(req, 'error', { value: new DOMException('quota') });
        req.onerror?.(new Event('error'));
      });
      return req;
    });
    await expect(saveEntry(entry('a', '2026-11-27T09:00:00.000Z'))).rejects.toThrow('quota');
    put.mockRestore();
  });
});
