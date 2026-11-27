'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Camera } from 'lucide-react';
import type { GenerativeModel, InferenceSource } from 'firebase/ai';

import {
  describePhoto,
  ON_DEVICE_OPTIONS,
  photoModel,
  type Condition,
  type PhotoDescription,
  type PhotoInput,
} from '@/lib/walkthrough/describe-photo';
import { preparePhoto } from '@/lib/walkthrough/image';

type Entry = {
  id: string;
  room: string;
  note: string;
  takenAt: string;
  photo: PhotoInput;
  previewUrl: string;
  status: 'describing' | 'done' | 'waiting';
  description?: PhotoDescription;
  source?: InferenceSource;
  error?: string;
};

type LocalModel = 'available' | 'downloadable' | 'downloading' | 'unavailable' | 'checking';

const ROOMS = ['Kitchen', 'Living room', 'Bedroom', 'Bathroom', 'Hallway', 'Closet'];

const CONDITION_STYLE: Record<Condition, string> = {
  good: 'bg-card',
  worn: 'bg-sev-check-tint',
  damaged: 'bg-sev-unenforceable-tint',
  missing: 'bg-sev-unenforceable-tint',
};

const LOCAL_MODEL_TEXT: Record<LocalModel, string> = {
  checking: 'Checking whether this browser has an on-device model.',
  available: 'This browser describes photos on the device, so it works without Wi-Fi.',
  downloading:
    'This browser is downloading its on-device model. Until it finishes, photos go to the cloud.',
  downloadable:
    'This browser can download an on-device model. The first photo starts the download; until then, photos go to the cloud.',
  unavailable: 'This browser has no on-device model, so photos are described in the cloud.',
};

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

function SourceLabel({ source }: { source?: InferenceSource }) {
  if (!source) return null;
  return (
    <span className="border-2 border-border bg-card px-2 py-0.5 font-mono text-[0.6875rem] uppercase tracking-[0.06em]">
      {source === 'on_device' ? 'Ran on this device' : 'Ran in the cloud'}
    </span>
  );
}

export function Walkthrough() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [room, setRoom] = useState('');
  const [note, setNote] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [localModel, setLocalModel] = useState<LocalModel>('checking');
  const modelRef = useRef<GenerativeModel | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    checkLocalModel().then(setLocalModel);
  }, []);

  function update(id: string, patch: Partial<Entry>) {
    setEntries((all) => all.map((e) => (e.id === id ? { ...e, ...patch } : e)));
  }

  async function describe(entry: Entry) {
    update(entry.id, { status: 'describing', error: undefined });
    try {
      modelRef.current ??= photoModel();
      const { description, source } = await describePhoto(
        modelRef.current,
        entry.photo,
        entry.room,
        entry.note
      );
      update(entry.id, { status: 'done', description, source });
    } catch (err) {
      const offline = typeof navigator !== 'undefined' && !navigator.onLine;
      update(entry.id, {
        status: 'waiting',
        error: offline
          ? 'No connection and no on-device model. The photo is saved; describe it when you are back online.'
          : err instanceof Error
            ? err.message
            : 'Could not describe this photo.',
      });
    }
  }

  async function add(e: FormEvent) {
    e.preventDefault();
    if (!file) return;
    setBusy(true);
    setFormError(null);
    try {
      const { photo, blob } = await preparePhoto(file);
      const entry: Entry = {
        id: crypto.randomUUID(),
        room: room.trim() || 'Unnamed room',
        note: note.trim(),
        takenAt: new Date().toISOString(),
        photo,
        previewUrl: URL.createObjectURL(blob),
        status: 'describing',
      };
      setEntries((all) => [entry, ...all]);
      setFile(null);
      setNote('');
      if (fileInput.current) fileInput.current.value = '';
      void describe(entry);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Could not read that photo.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-2xl px-5 py-12 sm:px-8 sm:py-16">
      <h1 className="font-display text-[clamp(2rem,4vw,2.75rem)] uppercase leading-[0.95] tracking-[-0.02em]">
        Record the apartment before you unpack.
      </h1>
      <p className="mt-3 text-[1rem] leading-relaxed text-muted-foreground">
        Take a photo in each room. Each one becomes a dated description of what was already worn or
        damaged on move-in day, which is the evidence most deposit disputes turn on.
      </p>
      <p className="mt-4 border-2 border-border bg-card px-4 py-3 text-sm" role="status">
        {LOCAL_MODEL_TEXT[localModel]}
      </p>

      <form onSubmit={add} className="mt-8 space-y-5">
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="room"
            className="font-mono text-[0.75rem] uppercase tracking-[0.06em] text-muted-foreground"
          >
            Room
          </label>
          <input
            id="room"
            list="room-names"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            placeholder="Kitchen"
            className="border-2 border-border bg-card px-3 py-2 text-[0.9375rem] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          <datalist id="room-names">
            {ROOMS.map((r) => (
              <option key={r} value={r} />
            ))}
          </datalist>
        </div>

        <label
          htmlFor="photo"
          className="flex cursor-pointer flex-col items-center justify-center gap-3 border-[3px] border-dashed border-border bg-card px-6 py-10 text-center hover:bg-accent"
        >
          <span className="inline-flex border-2 border-border bg-accent p-3 text-primary">
            <Camera className="h-5 w-5" strokeWidth={2} aria-hidden />
          </span>
          <span className="font-display text-xl uppercase tracking-[-0.01em]">
            {file ? file.name : 'Take or choose a photo'}
          </span>
          <input
            id="photo"
            ref={fileInput}
            type="file"
            accept="image/*"
            capture="environment"
            className="sr-only"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
        </label>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="note"
            className="font-mono text-[0.75rem] uppercase tracking-[0.06em] text-muted-foreground"
          >
            Note (optional)
          </label>
          <textarea
            id="note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={2}
            placeholder="Burn mark on the counter left of the sink"
            className="border-2 border-border bg-card px-3 py-2 text-[0.9375rem] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>

        <button
          type="submit"
          disabled={!file || busy}
          className="ll-shadow-sm inline-flex items-center justify-center border-2 border-border bg-primary px-5 py-2.5 font-display uppercase tracking-[0.01em] text-primary-foreground transition-transform hover:-translate-x-px hover:-translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-x-0 disabled:hover:translate-y-0"
        >
          Add to my record
        </button>
        {formError && (
          <p className="border-2 border-sev-unenforceable bg-sev-unenforceable-tint px-4 py-3 text-sm">
            {formError}
          </p>
        )}
      </form>

      <section aria-label="Move-in record" className="mt-12 space-y-6" aria-live="polite">
        {entries.map((entry) => (
          <article key={entry.id} className="ll-shadow border-2 border-border bg-card">
            {/* eslint-disable-next-line @next/next/no-img-element -- local blob URL */}
            <img
              src={entry.previewUrl}
              alt={`Move-in photo of the ${entry.room}`}
              className="aspect-[4/3] w-full border-b-2 border-border object-cover"
            />
            <div className="space-y-3 p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="font-display text-lg uppercase">{entry.room}</h2>
                <SourceLabel source={entry.source} />
              </div>
              <p className="font-mono text-[0.75rem] text-muted-foreground">
                <time dateTime={entry.takenAt}>
                  {new Date(entry.takenAt).toLocaleString(undefined, {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
                </time>
              </p>
              {entry.note && <p className="text-sm">Your note: {entry.note}</p>}

              {entry.status === 'describing' && (
                <p className="text-sm text-muted-foreground">Describing the photo…</p>
              )}
              {entry.status === 'waiting' && (
                <div className="space-y-2">
                  <p className="text-sm">{entry.error}</p>
                  <button
                    type="button"
                    onClick={() => describe(entry)}
                    className="border-2 border-border bg-card px-3 py-1.5 font-display text-sm uppercase hover:bg-accent"
                  >
                    Describe again
                  </button>
                </div>
              )}
              {entry.status === 'done' && entry.description && (
                <>
                  <p className="text-[0.9375rem]">{entry.description.summary}</p>
                  <ul className="space-y-2">
                    {entry.description.observations.map((o, i) => (
                      <li
                        key={`${o.item}-${i}`}
                        className={`border-2 border-border px-3 py-2 text-sm ${CONDITION_STYLE[o.condition]}`}
                      >
                        <span className="font-semibold">{o.item}</span>
                        <span className="ml-2 font-mono text-[0.75rem] uppercase">
                          {o.condition}
                        </span>
                        <span className="block text-muted-foreground">{o.detail}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </article>
        ))}
      </section>

      <p className="mt-12 text-sm leading-relaxed text-muted-foreground">
        Your record stays in this browser; LeaseLookout does not store it. When a photo is described
        in the cloud, it is sent to Google&apos;s Gemini API through Firebase. This is a record of
        what you saw, not legal advice.
      </p>
    </main>
  );
}
