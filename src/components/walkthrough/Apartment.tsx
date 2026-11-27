'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { formatDollars, returnDeadline, SAMPLE_CHARGE } from '@/lib/walkthrough/law';
import { ROOMS, roomBySlug, type RoomId } from '@/lib/walkthrough/rooms';

import type { MarkId, SceneApi } from './apartment-scene';
import { useRecord } from './RecordProvider';

const PLAN_W = 10;
const PLAN_H = 7;

function webgl2(): boolean {
  try {
    return !!document.createElement('canvas').getContext('webgl2');
  } catch {
    return false;
  }
}

/**
 * The apartment. Server HTML is a flat floor plan (also the reduced-motion and
 * no-WebGL view); on capable devices the 3D model fades in over it. Room
 * labels are links, but the room list below the model is the keyboard and
 * screen-reader route, so these copies stay out of the tab order.
 */
export function Apartment() {
  const host = useRef<HTMLDivElement>(null);
  const tagEls = useRef(new Map<RoomId, HTMLElement>());
  const markEls = useRef(new Map<MarkId, HTMLElement>());
  const api = useRef<SceneApi | null>(null);
  const [mode, setMode] = useState<'plan' | 'model'>('plan');
  const pathname = usePathname();
  const active = roomBySlug(pathname.split('/')[2] ?? '');
  const { entries, deposit } = useRecord();
  const deadline = returnDeadline(deposit.state);

  const counts = useMemo(() => {
    const c = Object.fromEntries(ROOMS.map((r) => [r.id, 0])) as Record<RoomId, number>;
    for (const e of entries) c[e.roomId] += 1;
    return c;
  }, [entries]);

  useEffect(() => {
    const el = host.current;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!el || reduced || !webgl2()) return;
    let gone = false;
    import('./apartment-scene')
      .then(({ mountApartment }) => mountApartment(el, tagEls.current, markEls.current, reduced))
      .then((scene) => {
        if (gone) return scene.dispose();
        api.current = scene;
        setMode('model');
      })
      .catch((err) => console.error('apartment model failed to load', err));
    return () => {
      gone = true;
      api.current?.dispose();
      api.current = null;
    };
  }, []);

  useEffect(() => {
    api.current?.focus(active?.id);
  }, [active?.id, mode]);

  useEffect(() => {
    api.current?.setCounts(counts);
  }, [counts, mode]);

  const answered = counts[SAMPLE_CHARGE.room] > 0;
  useEffect(() => {
    api.current?.setCharge(answered);
  }, [answered, mode]);

  return (
    <div
      ref={host}
      className="apartment relative aspect-[4/3] w-full overflow-hidden lg:aspect-auto lg:h-full"
      data-mode={mode}
    >
      {/* Flat plan: first paint, and the whole view without motion or WebGL. */}
      <div
        className="apartment__plan absolute inset-[8%] transition-opacity duration-500"
        aria-hidden="true"
      >
        {ROOMS.map((room) => {
          const [x0, y0, x1, y1] = room.rect;
          return (
            <Link
              key={room.id}
              href={`/walkthrough/${room.slug}`}
              tabIndex={-1}
              className={`absolute flex items-center justify-center border-2 border-[var(--ink)] p-1 text-center font-display text-[0.8rem] leading-tight transition-colors sm:text-sm ${
                counts[room.id] > 0 ? 'bg-[var(--recorded-tint)]' : 'bg-[var(--bare)]'
              } ${active?.id === room.id ? 'outline outline-[3px] outline-[var(--recorded)]' : ''}`}
              style={{
                left: `${(x0 / PLAN_W) * 100}%`,
                top: `${((PLAN_H - y1) / PLAN_H) * 100}%`,
                width: `${((x1 - x0) / PLAN_W) * 100}%`,
                height: `${((y1 - y0) / PLAN_H) * 100}%`,
              }}
            >
              {room.name}
            </Link>
          );
        })}
      </div>

      {/* Labels that ride on the 3D model. Positioned every frame by the scene. */}
      <div className="apartment__tags absolute inset-0" aria-hidden="true">
        {ROOMS.map((room) => (
          <Link
            key={room.id}
            href={`/walkthrough/${room.slug}`}
            tabIndex={-1}
            ref={(el) => {
              if (el) tagEls.current.set(room.id, el);
              else tagEls.current.delete(room.id);
            }}
            className={`apartment__tag absolute left-0 top-0 inline-flex items-center gap-1.5 whitespace-nowrap border-2 border-[var(--ink)] px-2 py-1 font-display text-[0.75rem] leading-none sm:text-sm ${
              active?.id === room.id
                ? 'bg-[var(--ink)] text-[var(--ground)]'
                : 'bg-[var(--ground)] text-[var(--ink)]'
            }`}
          >
            {room.name}
            {counts[room.id] > 0 && (
              <span className="font-mono text-[0.7rem] tabular-nums">{counts[room.id]}</span>
            )}
          </Link>
        ))}

        {/* The stakes, on the front door you walk in through. */}
        <Link
          href="/walkthrough#deposit"
          tabIndex={-1}
          ref={(el) => {
            if (el) markEls.current.set('door', el);
            else markEls.current.delete('door');
          }}
          className="apartment__mark absolute left-0 top-0 border-2 border-[var(--ink)] bg-[var(--ink)] px-2.5 py-1.5 text-[var(--ground)]"
        >
          <span className="block font-display text-base leading-none sm:text-lg">
            {deposit.amount ? `${formatDollars(deposit.amount)} at stake` : 'Your deposit'}
          </span>
          <span className="mt-1 block font-mono text-[0.65rem] leading-tight">
            Back within {deadline.days} days ({deadline.code.toUpperCase()})
          </span>
        </Link>

        {/* A sample move-out charge, answered by a move-in photo of that room. */}
        <span
          ref={(el) => {
            if (el) markEls.current.set('charge', el);
            else markEls.current.delete('charge');
          }}
          className={`apartment__mark apartment__mark--claim absolute left-0 top-0 max-w-[12rem] border-2 border-[var(--ink)] px-2 py-1 font-mono text-[0.65rem] leading-tight shadow-[3px_3px_0_var(--ink)] ${
            answered
              ? 'bg-[var(--recorded)] text-[#0e0e0e]'
              : 'bg-[var(--ground)] text-[var(--ink)]'
          }`}
        >
          {answered
            ? 'Already there on day one. Your photo answers it.'
            : `Landlord's claim (example): ${formatDollars(SAMPLE_CHARGE.amount)}, ${SAMPLE_CHARGE.item}`}
        </span>
      </div>
    </div>
  );
}
