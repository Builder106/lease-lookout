'use client';

import { useState } from 'react';
import Link from 'next/link';

import {
  DEPOSIT_STATES,
  formatDollars,
  parseAmount,
  returnDeadline,
  type StateCode,
} from '@/lib/walkthrough/law';

import { useRecord } from './RecordProvider';
import { DeductionReview } from './DeductionReview';
import { RoomList } from './RoomList';
import { LocalModelNote } from './WalkthroughFrame';

function DepositForm() {
  const { deposit, setDeposit } = useRecord();
  const [draft, setDraft] = useState('');
  const deadline = returnDeadline(deposit.state);
  return (
    <section
      id="deposit"
      aria-labelledby="deposit-title"
      className="scroll-mt-6 space-y-3 border-2 border-[var(--ink)] p-4"
    >
      <h2 id="deposit-title" className="font-display text-xl">
        {deposit.amount ? `${formatDollars(deposit.amount)} at stake` : 'What is your deposit?'}
      </h2>
      <form
        className="flex flex-wrap items-end gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          const amount = parseAmount(draft);
          if (amount) setDeposit({ ...deposit, amount });
        }}
      >
        <label className="flex flex-col gap-1 text-sm text-[var(--muted)]">
          Amount
          <input
            inputMode="decimal"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={deposit.amount ? formatDollars(deposit.amount) : '$1,450'}
            className="w-32 border-2 border-[var(--ink)] bg-[var(--ground)] px-3 py-2 text-[var(--ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--recorded)]"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-[var(--muted)]">
          State
          <select
            value={deposit.state}
            onChange={(e) => setDeposit({ ...deposit, state: e.target.value as StateCode })}
            className="border-2 border-[var(--ink)] bg-[var(--ground)] px-3 py-2 text-[var(--ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--recorded)]"
          >
            {Object.values(DEPOSIT_STATES).map((s) => (
              <option key={s.code} value={s.code}>
                {s.name}
              </option>
            ))}
          </select>
        </label>
        <button
          type="submit"
          className="settle border-2 border-[var(--ink)] bg-[var(--recorded)] px-4 py-2 font-display text-[#0e0e0e] shadow-[3px_3px_0_var(--ink)]"
        >
          Set
        </button>
      </form>
      <p className="text-sm leading-relaxed">
        After you move out, your landlord has {deadline.days} days to return it, {deadline.detail}.{' '}
        <a
          href={deadline.cite.url}
          className="underline underline-offset-4"
          target="_blank"
          rel="noreferrer"
        >
          {deadline.cite.label}
        </a>
      </p>
      <p className="text-sm leading-relaxed text-[var(--muted)]">
        The pink pin in the living room is an example of a charge a landlord might send later.
        Photograph that room and see your record answer it.
      </p>
    </section>
  );
}

export function WalkthroughIndex() {
  return (
    <div className="space-y-8 px-5 py-6 sm:px-8 lg:py-8">
      <div className="space-y-4">
        <h1 className="font-display text-[clamp(2rem,4vw,2.75rem)] leading-[0.95] tracking-[-0.02em]">
          Pin today&apos;s damage so it can&apos;t come out of your deposit.
        </h1>
        <p className="text-[1rem] leading-relaxed text-[var(--muted)]">
          Photograph what is already worn or broken in each room. Each photo pins to its room with
          the date, so when the landlord sends deductions you can show what was there on day one.
        </p>
        <LocalModelNote />
      </div>

      <DepositForm />

      <RoomList />

      <DeductionReview />

      <p className="text-sm leading-relaxed text-[var(--muted)]">
        Your record stays in this browser; LeaseLookout does not store it. When a photo is described
        in the cloud, it goes to Google&apos;s Gemini API through Firebase. The apartment is a
        sample one-bedroom, not your floor plan. This is legal information with citations, not legal
        advice.{' '}
        <Link href="/privacy" className="underline underline-offset-4 hover:text-[var(--ink)]">
          Privacy policy
        </Link>
      </p>
    </div>
  );
}
