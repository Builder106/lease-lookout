'use client';

import Link from 'next/link';
import { Cloud, WifiOff } from 'lucide-react';

import { Wordmark } from '@/components/BrandMark';
import { ROOMS } from '@/lib/walkthrough/rooms';

import { Apartment } from './Apartment';
import { RecordProvider, useRecord, type LocalModel } from './RecordProvider';

const LOCAL_MODEL_TEXT: Record<LocalModel, string> = {
  checking: 'Checking whether this browser can describe photos on its own.',
  available: 'Works without Wi-Fi: this browser describes photos on the device.',
  downloading:
    'This browser is downloading its on-device model. Until it finishes, photos are described in the cloud.',
  downloadable:
    'This browser can describe photos on the device after a one-time download, which your first photo starts.',
  unavailable: 'Photos are described in the cloud, because this browser has no on-device model.',
};

export function LocalModelNote() {
  const { localModel } = useRecord();
  const Icon = localModel === 'available' ? WifiOff : Cloud;
  return (
    <p role="status" className="flex items-start gap-2.5 text-sm leading-snug">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-[var(--recorded)]" aria-hidden />
      {LOCAL_MODEL_TEXT[localModel]}
    </p>
  );
}

function Progress() {
  const { entries, loaded } = useRecord();
  const done = new Set(entries.map((e) => e.roomId)).size;
  return (
    <p className="font-mono text-xs tabular-nums text-[var(--muted)]" aria-live="polite">
      {loaded ? `${done} of ${ROOMS.length} rooms recorded` : 'Opening your record'}
    </p>
  );
}

export function WalkthroughFrame({ children }: { children: React.ReactNode }) {
  return (
    <RecordProvider>
      <div className="walkthrough min-h-svh lg:grid lg:h-svh lg:grid-cols-[minmax(0,1fr)_27rem] lg:overflow-hidden">
        <a
          href="#record"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:border-2 focus:border-[var(--ink)] focus:bg-[var(--ground)] focus:px-3 focus:py-2"
        >
          Skip to your record
        </a>
        <div className="flex flex-col lg:h-svh">
          <header className="flex items-center justify-between gap-4 px-5 py-4 sm:px-8">
            <Link href="/" aria-label="LeaseLookout home">
              <Wordmark />
            </Link>
            <Progress />
          </header>
          <section aria-label="Your apartment" className="lg:min-h-0 lg:flex-1">
            <Apartment />
          </section>
        </div>
        <main
          id="record"
          className="border-t-2 border-[var(--ink)] lg:overflow-y-auto lg:border-l-2 lg:border-t-0"
        >
          {children}
        </main>
      </div>
    </RecordProvider>
  );
}
