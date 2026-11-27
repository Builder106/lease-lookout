'use client';

import { useRef, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Camera } from 'lucide-react';

import type { Condition } from '@/lib/walkthrough/describe-photo';
import { roomLaw } from '@/lib/walkthrough/law';
import { nextRoom, roomById, type RoomId } from '@/lib/walkthrough/rooms';
import type { Entry } from '@/lib/walkthrough/store';

import { useRecord } from './RecordProvider';
import { LocalModelNote } from './WalkthroughFrame';

const CONDITION_STYLE: Record<Condition, string> = {
  good: '',
  worn: 'bg-[var(--recorded-tint)]',
  damaged: 'bg-[var(--recorded-tint)] font-semibold',
  missing: 'bg-[var(--recorded-tint)] font-semibold',
};

function Stamp({ entry }: { entry: Entry }) {
  const time = new Date(entry.takenAt).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
  const where =
    entry.source === 'on_device'
      ? 'Described on this device'
      : entry.source === 'in_cloud'
        ? 'Described in the cloud'
        : entry.status === 'describing'
          ? 'Describing'
          : 'Waiting to be described';
  return (
    <p className="inline-flex -rotate-1 flex-col border-2 border-[var(--ink)] px-2 py-1 font-mono text-[0.7rem] uppercase leading-snug tracking-[0.04em]">
      <time dateTime={entry.takenAt}>{time}</time>
      <span>{where}</span>
    </p>
  );
}

function EntryCard({ entry }: { entry: Entry }) {
  const { retry, remove } = useRecord();
  const [confirming, setConfirming] = useState(false);
  return (
    <li className="border-2 border-[var(--ink)]">
      {/* eslint-disable-next-line @next/next/no-img-element -- local data URL */}
      <img
        src={`data:${entry.photo.mimeType};base64,${entry.photo.base64}`}
        alt={entry.description?.summary || `Move-in photo of the ${roomById(entry.roomId)?.name}`}
        className="aspect-[4/3] w-full border-b-2 border-[var(--ink)] object-cover"
      />
      <div className="space-y-3 p-4">
        <Stamp entry={entry} />
        {entry.note && <p className="text-sm">Your note: {entry.note}</p>}
        {entry.status === 'describing' && (
          <p className="text-sm text-[var(--muted)]">Looking at the photo.</p>
        )}
        {entry.status === 'waiting' && (
          <div className="space-y-2">
            <p className="text-sm">{entry.error}</p>
            <button
              type="button"
              onClick={() => retry(entry)}
              className="settle border-2 border-[var(--ink)] px-3 py-1.5 text-sm"
            >
              Describe it now
            </button>
          </div>
        )}
        {entry.status === 'done' && entry.description && (
          <>
            <p className="text-[0.9375rem] leading-relaxed">{entry.description.summary}</p>
            <p className="text-xs text-[var(--muted)]">
              Written by AI from your photo. Check it against the photo; the photo is the evidence.
            </p>
            <ul className="space-y-1.5">
              {entry.description.observations.map((o, i) => (
                <li
                  key={`${o.item}-${i}`}
                  className={`border-2 border-[var(--ink)] px-3 py-2 text-sm ${CONDITION_STYLE[o.condition]}`}
                >
                  <span className="font-semibold">{o.item}</span>
                  <span className="ml-2 font-mono text-[0.7rem] uppercase">{o.condition}</span>
                  <span className="block text-[var(--muted)]">{o.detail}</span>
                </li>
              ))}
            </ul>
          </>
        )}
        <button
          type="button"
          onClick={() => (confirming ? remove(entry) : setConfirming(true))}
          onBlur={() => setConfirming(false)}
          className="text-sm text-[var(--muted)] underline underline-offset-4 hover:text-[var(--ink)]"
        >
          {confirming ? 'Tap again to delete this photo' : 'Delete photo'}
        </button>
      </div>
    </li>
  );
}

export function RoomRecord({ roomId }: { roomId: RoomId }) {
  const room = roomById(roomId)!;
  const next = nextRoom(room);
  const { entries, add, deposit } = useRecord();
  const law = roomLaw(deposit.state, roomId);
  const mine = entries.filter((e) => e.roomId === roomId).reverse();
  const [file, setFile] = useState<File | null>(null);
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const input = useRef<HTMLInputElement>(null);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      await add(roomId, file, note);
      setFile(null);
      setNote('');
      if (input.current) input.current.value = '';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not read that photo.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-8 px-5 py-6 sm:px-8 lg:py-8">
      <Link
        href="/walkthrough"
        className="settle inline-flex items-center gap-2 text-sm text-[var(--muted)] hover:text-[var(--ink)]"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden /> All rooms
      </Link>

      <div className="space-y-3">
        <h1 className="font-display text-[clamp(2rem,4vw,2.6rem)] leading-[0.95] tracking-[-0.02em]">
          {room.name}
        </h1>
        <p className="text-[1rem] leading-relaxed text-[var(--muted)]">
          Photograph {room.checklist.charAt(0).toLowerCase() + room.checklist.slice(1)}
        </p>
        <p className="border-2 border-[var(--ink)] px-3 py-2 text-sm leading-relaxed">
          {law.text}{' '}
          <a
            href={law.cite.url}
            target="_blank"
            rel="noreferrer"
            className="whitespace-nowrap font-mono text-xs underline underline-offset-4"
          >
            {law.cite.label}
          </a>
        </p>
        <LocalModelNote />
      </div>

      <form onSubmit={submit} className="space-y-4">
        <label
          htmlFor="photo"
          className="settle flex cursor-pointer items-center gap-4 border-2 border-[var(--ink)] bg-[var(--ground)] p-4"
        >
          <span className="inline-flex border-2 border-[var(--ink)] bg-[var(--recorded)] p-2.5 text-white">
            <Camera className="h-5 w-5" aria-hidden />
          </span>
          <span className="min-w-0">
            <span className="block font-display text-lg">
              {file ? 'Photo ready' : `Take a photo of the ${room.name.toLowerCase()}`}
            </span>
            <span className="block truncate text-sm text-[var(--muted)]">
              {file ? file.name : 'Or choose one you already took'}
            </span>
          </span>
          <input
            id="photo"
            ref={input}
            type="file"
            accept="image/*"
            capture="environment"
            className="sr-only"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
        </label>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="note" className="text-sm text-[var(--muted)]">
            Note, if the photo needs one
          </label>
          <textarea
            id="note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={2}
            placeholder="Burn mark on the counter left of the sink"
            className="border-2 border-[var(--ink)] bg-[var(--ground)] px-3 py-2 text-[0.9375rem] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--recorded)]"
          />
        </div>
        <button
          type="submit"
          disabled={!file || busy}
          className="settle w-full border-2 border-[var(--ink)] bg-[var(--ink)] px-5 py-3 font-display text-[var(--ground)] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {busy ? 'Saving' : `Pin it to the ${room.name.toLowerCase()}`}
        </button>
        {error && (
          <p className="border-2 border-[var(--charge)] px-4 py-3 text-sm" role="alert">
            {error}
          </p>
        )}
      </form>

      {mine.length > 0 && (
        <section aria-label={`${room.name} photos`}>
          <ul className="space-y-6" aria-live="polite">
            {mine.map((entry) => (
              <EntryCard key={entry.id} entry={entry} />
            ))}
          </ul>
        </section>
      )}

      {next ? (
        <Link
          href={`/walkthrough/${next.slug}`}
          className="settle flex items-center justify-between border-2 border-[var(--ink)] p-4"
        >
          <span>
            <span className="block text-sm text-[var(--muted)]">Next room</span>
            <span className="font-display text-lg">{next.name}</span>
          </span>
          <ArrowRight className="h-5 w-5" aria-hidden />
        </Link>
      ) : (
        <Link
          href="/walkthrough"
          className="settle flex items-center justify-between border-2 border-[var(--ink)] p-4"
        >
          <span className="font-display text-lg">That was the last room</span>
          <ArrowRight className="h-5 w-5" aria-hidden />
        </Link>
      )}
    </div>
  );
}
