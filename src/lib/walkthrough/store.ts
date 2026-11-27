import type { InferenceSource } from 'firebase/ai';

import type { PhotoDescription, PhotoInput } from '@/lib/walkthrough/describe-photo';
import type { RoomId } from '@/lib/walkthrough/rooms';

export type Entry = {
  id: string;
  roomId: RoomId;
  note: string;
  takenAt: string;
  photo: PhotoInput;
  status: 'describing' | 'done' | 'waiting';
  description?: PhotoDescription;
  source?: InferenceSource;
  error?: string;
};

// The move-in record lives only in this browser. IndexedDB keeps it through
// reloads and offline use; nothing here talks to a server.
const DB = 'leaselookout-walkthrough';
const STORE = 'entries';

function open(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE, { keyPath: 'id' });
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function run<T>(
  mode: IDBTransactionMode,
  work: (store: IDBObjectStore) => IDBRequest<T>
): Promise<T> {
  const db = await open();
  try {
    return await new Promise<T>((resolve, reject) => {
      const req = work(db.transaction(STORE, mode).objectStore(STORE));
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  } finally {
    db.close();
  }
}

/** All entries, oldest first. An entry still "describing" when the page closed is retried. */
export async function loadEntries(): Promise<Entry[]> {
  const all = await run<Entry[]>('readonly', (s) => s.getAll() as IDBRequest<Entry[]>);
  return all
    .map((e) => (e.status === 'describing' ? { ...e, status: 'waiting' as const } : e))
    .sort((a, b) => a.takenAt.localeCompare(b.takenAt));
}

export async function saveEntry(entry: Entry): Promise<void> {
  await run('readwrite', (s) => s.put(entry));
}

export async function deleteEntry(id: string): Promise<void> {
  await run('readwrite', (s) => s.delete(id));
}
