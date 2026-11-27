'use client';

import { useRef, useState, type FormEvent } from 'react';
import type { GenerativeModel, InferenceSource } from 'firebase/ai';

import {
  compareDeductions,
  comparisonModel,
  type Comparison,
  type Evidence,
  type Finding,
} from '@/lib/walkthrough/compare';
import { redactSensitiveText, type Redaction } from '@/lib/walkthrough/redact';

import { useRecord } from './RecordProvider';

const FINDING_LABEL: Record<Finding, string> = {
  already_there: 'Recorded at move-in',
  not_recorded: 'Not recorded at move-in',
  unclear: 'The record is unclear',
};

function recordEvidence(entries: ReturnType<typeof useRecord>['entries']): Evidence[] {
  return entries.flatMap((entry) =>
    entry.description
      ? [{ room: entry.roomId, takenAt: entry.takenAt, description: entry.description }]
      : []
  );
}

export function DeductionReview() {
  const { entries } = useRecord();
  const model = useRef<GenerativeModel | null>(null);
  const [letter, setLetter] = useState('');
  const [cleanedLetter, setCleanedLetter] = useState('');
  const [redaction, setRedaction] = useState<Redaction | null>(null);
  const [comparison, setComparison] = useState<Comparison | null>(null);
  const [source, setSource] = useState<InferenceSource | undefined>();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const evidence = recordEvidence(entries);

  function cleanLetter() {
    const result = redactSensitiveText(letter);
    setRedaction(result);
    setCleanedLetter(result.text);
    setComparison(null);
    setSource(undefined);
    setError(null);
  }

  async function compare(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!cleanedLetter.trim()) {
      setError('Clean the deduction letter before comparing it.');
      return;
    }
    if (!evidence.length) {
      setError('Describe at least one move-in photo before comparing deductions.');
      return;
    }
    setBusy(true);
    setError(null);
    try {
      model.current ??= comparisonModel();
      const result = await compareDeductions(model.current, cleanedLetter, evidence);
      setComparison(result.comparison);
      setSource(result.source);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Could not compare the deductions.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <section
      aria-labelledby="deduction-review-title"
      className="space-y-4 border-2 border-[var(--ink)] p-4"
    >
      <div className="space-y-2">
        <h2 id="deduction-review-title" className="font-display text-xl">
          Compare a deduction letter with your record
        </h2>
        <p className="text-sm leading-relaxed text-[var(--muted)]">
          Clean the letter on this device first. You can review and edit the cleaned version before
          comparing it with your move-in descriptions.
        </p>
      </div>

      <form onSubmit={compare} className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="deduction-letter" className="text-sm text-[var(--muted)]">
            Landlord&apos;s deduction letter
          </label>
          <textarea
            id="deduction-letter"
            name="deduction-letter"
            value={letter}
            onChange={(event) => setLetter(event.target.value)}
            rows={6}
            placeholder="Paste the itemized deductions here."
            className="w-full border-2 border-[var(--ink)] bg-[var(--ground)] px-3 py-2 text-[0.9375rem] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--recorded)]"
          />
          <p id="deduction-letter-help" className="text-xs leading-relaxed text-[var(--muted)]">
            The original letter stays in this browser.
          </p>
        </div>

        <button
          type="button"
          onClick={cleanLetter}
          disabled={!letter.trim()}
          className="settle border-2 border-[var(--ink)] px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
        >
          Clean personal details on this device
        </button>

        {redaction && (
          <div className="space-y-2">
            <label htmlFor="cleaned-letter" className="text-sm text-[var(--muted)]">
              Review the cleaned letter before sending it
            </label>
            <textarea
              id="cleaned-letter"
              name="cleaned-letter"
              value={cleanedLetter}
              onChange={(event) => setCleanedLetter(event.target.value)}
              rows={6}
              aria-describedby="cleaned-letter-help"
              className="w-full border-2 border-[var(--ink)] bg-[var(--ground)] px-3 py-2 text-[0.9375rem] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--recorded)]"
            />
            <p id="cleaned-letter-help" className="text-xs leading-relaxed text-[var(--muted)]">
              {redaction.replacements === 1
                ? 'One detail was removed automatically.'
                : `${redaction.replacements} details were removed automatically.`}{' '}
              Remove any name or address that remains before you compare it.
            </p>
          </div>
        )}

        <p className="border-2 border-[var(--ink)] px-3 py-2 text-sm leading-relaxed">
          Comparing sends the cleaned letter and {evidence.length} saved condition{' '}
          {evidence.length === 1 ? 'description' : 'descriptions'} to Google&apos;s Gemini API. Your
          original letter and photos stay in this browser.
        </p>

        <button
          type="submit"
          disabled={busy || !cleanedLetter.trim() || !evidence.length}
          className="settle border-2 border-[var(--ink)] bg-[var(--recorded)] px-4 py-2 font-display text-[#0e0e0e] shadow-[3px_3px_0_var(--ink)] disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
        >
          {busy ? 'Comparing' : 'Compare cleaned letter'}
        </button>

        {error && (
          <p className="border-2 border-[var(--charge)] px-3 py-2 text-sm" role="alert">
            {error}
          </p>
        )}
      </form>

      {comparison && (
        <div className="space-y-3" aria-live="polite">
          <h3 className="font-display text-lg">What your move-in record shows</h3>
          <p className="text-sm text-[var(--muted)]">
            {source === 'on_device' ? 'Compared on this device.' : 'Compared in the cloud.'}
          </p>
          {comparison.matches.length ? (
            <ul className="space-y-2">
              {comparison.matches.map((match, index) => (
                <li key={`${match.charge}-${index}`} className="border-2 border-[var(--ink)] p-3">
                  <p className="font-semibold">{match.charge}</p>
                  <p className="mt-1 text-sm">{FINDING_LABEL[match.finding]}</p>
                  <p className="mt-1 text-sm text-[var(--muted)]">{match.evidence}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-[var(--muted)]">
              No separate deductions were found in the cleaned letter.
            </p>
          )}
          <p className="text-xs leading-relaxed text-[var(--muted)]">
            This comparison organizes your record. Check each result against your photos and the
            original letter. It is not legal advice.
          </p>
        </div>
      )}
    </section>
  );
}
