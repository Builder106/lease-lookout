'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';
import type { GenerativeModel } from 'firebase/ai';

import { describePhoto, ON_DEVICE_OPTIONS, photoModel } from '@/lib/walkthrough/describe-photo';
import { preparePhoto } from '@/lib/walkthrough/image';
import type { StateCode } from '@/lib/walkthrough/law';
import { roomById, type RoomId } from '@/lib/walkthrough/rooms';
import { deleteEntry, loadEntries, saveEntry, type Entry } from '@/lib/walkthrough/store';

export type LocalModel = 'available' | 'downloadable' | 'downloading' | 'unavailable' | 'checking';

type Record = {
  entries: Entry[];
  loaded: boolean;
  localModel: LocalModel;
  add: (roomId: RoomId, file: File, note: string) => Promise<void>;
  retry: (entry: Entry) => void;
  remove: (entry: Entry) => void;
  deposit: Deposit;
  setDeposit: (d: Deposit) => void;
};

export type Deposit = { amount: number | null; state: StateCode };
const DEPOSIT_KEY = 'leaselookout-deposit';
const depositListeners = new Set<() => void>();
let depositFallback: string | null = null;

function subscribeDeposit(fn: () => void) {
  depositListeners.add(fn);
  addEventListener('storage', fn);
  return () => {
    depositListeners.delete(fn);
    removeEventListener('storage', fn);
  };
}

function readDeposit(): string | null {
  try {
    return localStorage.getItem(DEPOSIT_KEY);
  } catch {
    return depositFallback;
  }
}

function parseDeposit(raw: string | null): Deposit {
  try {
    const d = JSON.parse(raw ?? 'null') as Deposit | null;
    if (d && (d.state === 'ct' || d.state === 'ma')) return d;
  } catch {
    /* ignore a damaged value */
  }
  return { amount: null, state: 'ct' };
}

const RecordContext = createContext<Record | null>(null);

export function useRecord(): Record {
  const ctx = useContext(RecordContext);
  if (!ctx) throw new Error('useRecord must be used inside <RecordProvider>');
  return ctx;
}

async function checkLocalModel(): Promise<LocalModel> {
  const lm = (
    globalThis as { LanguageModel?: { availability: (options: object) => Promise<string> } }
  ).LanguageModel;
  if (!lm) return 'unavailable';
  try {
    const state = await lm.availability(ON_DEVICE_OPTIONS);
    return state === 'available' || state === 'downloadable' || state === 'downloading'
      ? state
      : 'unavailable';
  } catch {
    return 'unavailable';
  }
}

export function RecordProvider({ children }: { children: React.ReactNode }) {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [localModel, setLocalModel] = useState<LocalModel>('checking');
  const modelRef = useRef<GenerativeModel | null>(null);
  // The deposit lives in localStorage; reading it as an external store keeps the
  // server render and the first client render identical.
  const depositRaw = useSyncExternalStore(subscribeDeposit, readDeposit, () => null);
  const deposit = useMemo(() => parseDeposit(depositRaw), [depositRaw]);
  const setDeposit = useCallback((d: Deposit) => {
    try {
      localStorage.setItem(DEPOSIT_KEY, JSON.stringify(d));
    } catch {
      depositFallback = JSON.stringify(d); // storage blocked: kept for this visit
    }
    depositListeners.forEach((fn) => fn());
  }, []);

  const put = useCallback((entry: Entry) => {
    setEntries((all) =>
      all.some((e) => e.id === entry.id)
        ? all.map((e) => (e.id === entry.id ? entry : e))
        : [...all, entry]
    );
    void saveEntry(entry).catch(() => {
      /* a private window may refuse storage; the record still works for this visit */
    });
  }, []);

  const describe = useCallback(
    async (entry: Entry) => {
      put({ ...entry, status: 'describing', error: undefined });
      try {
        modelRef.current ??= photoModel();
        const { description, source } = await describePhoto(
          modelRef.current,
          entry.photo,
          roomById(entry.roomId)?.name ?? entry.roomId,
          entry.note
        );
        put({ ...entry, status: 'done', description, source, error: undefined });
      } catch (err) {
        const offline = !navigator.onLine;
        put({
          ...entry,
          status: 'waiting',
          error: offline
            ? 'Saved. No connection and no on-device model, so it will be described when you are back online.'
            : err instanceof Error
              ? err.message
              : 'Could not describe this photo.',
        });
      }
    },
    [put]
  );

  useEffect(() => {
    checkLocalModel().then(setLocalModel);
    loadEntries()
      .then((saved) => {
        setEntries(saved);
        saved.filter((e) => e.status === 'waiting').forEach((e) => void describe(e));
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, [describe]);

  const latest = useRef(entries);
  useEffect(() => {
    latest.current = entries;
  }, [entries]);

  useEffect(() => {
    const online = () =>
      latest.current.filter((e) => e.status === 'waiting').forEach((e) => void describe(e));
    addEventListener('online', online);
    return () => removeEventListener('online', online);
  }, [describe]);

  const add = useCallback(
    async (roomId: RoomId, file: File, note: string) => {
      const { photo } = await preparePhoto(file);
      const entry: Entry = {
        id: crypto.randomUUID(),
        roomId,
        note: note.trim(),
        takenAt: new Date().toISOString(),
        photo,
        status: 'describing',
      };
      // Returns once the photo is saved; the description arrives on its own.
      void describe(entry);
    },
    [describe]
  );

  const remove = useCallback((entry: Entry) => {
    setEntries((all) => all.filter((e) => e.id !== entry.id));
    void deleteEntry(entry.id).catch(() => {});
  }, []);

  return (
    <RecordContext.Provider
      value={{
        entries,
        loaded,
        localModel,
        add,
        retry: (e) => void describe(e),
        remove,
        deposit,
        setDeposit,
      }}
    >
      {children}
    </RecordContext.Provider>
  );
}
