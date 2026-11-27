'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { ROOMS } from '@/lib/walkthrough/rooms';

import { useRecord } from './RecordProvider';

/** Every room as a plain link: the keyboard, screen-reader and phone route. */
export function RoomList() {
  const { entries } = useRecord();
  return (
    <nav aria-label="Rooms">
      <ul className="border-t-2 border-[var(--ink)]">
        {ROOMS.map((room) => {
          const n = entries.filter((e) => e.roomId === room.id).length;
          return (
            <li key={room.id} className="border-b-2 border-[var(--ink)]">
              <Link
                href={`/walkthrough/${room.slug}`}
                className="settle flex items-center justify-between gap-4 bg-[var(--ground)] px-1 py-4"
              >
                <span className="font-display text-lg">{room.name}</span>
                <span className="flex items-center gap-3 text-sm text-[var(--muted)]">
                  {n === 0 ? 'Not started' : n === 1 ? '1 photo' : `${n} photos`}
                  <ArrowRight className="h-4 w-4 text-[var(--ink)]" aria-hidden />
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
