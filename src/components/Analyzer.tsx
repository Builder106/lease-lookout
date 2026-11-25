'use client';

import { useState, type DragEvent, type FormEvent } from 'react';
import { FileText, Upload } from 'lucide-react';

import { LookoutReport } from '@/components/LookoutReport';
import { createClient } from '@/lib/supabase/client';
import { SUPPORTED_JURISDICTIONS } from '@/lib/jurisdictions';
import type { Report } from '@/lib/report-types';

const STEPS = [
  'Reading the document text',
  "Checking against your state's landlord–tenant law",
  'Drafting plain-English explanations',
];

export function Analyzer({ userId }: { userId: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<Report | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  // "auto" lets the engine detect the state from the lease text; or pin one.
  const [jurisdiction, setJurisdiction] = useState('auto');

  function pick(f: File | null) {
    setFile(f);
    setReport(null);
    setError(null);
    setSaved(false);
  }

  async function analyze(e: FormEvent) {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    setError(null);
    setReport(null);
    setSaved(false);
    try {
      const res = await fetch(`/api/analyze?jurisdiction=${encodeURIComponent(jurisdiction)}`, {
        method: 'POST',
        body: file,
      });
      const data: Report = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error || `Something went wrong (${res.status}).`);
        return;
      }
      setReport(data);
      try {
        const supabase = createClient();
        const { error: saveErr } = await supabase.from('analyses').insert({
          user_id: userId,
          filename: file.name,
          jurisdiction: data.jurisdiction,
          method: data.meta.method,
          pages: data.meta.pages,
          chars: data.meta.chars,
          flag_count: data.flags.length,
          report: data,
        });
        if (!saveErr) setSaved(true);
      } catch {
        /* saving is best-effort */
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error.');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <main className="mx-auto w-full max-w-2xl px-5 py-10 sm:px-8 sm:py-14">
        <div className="ll-shadow border-2 border-border bg-card p-8">
          <span className="zine-tag">Reading…</span>
          <h2 className="mt-4 font-display text-2xl uppercase tracking-[-0.01em]">
            Reading your lease.
          </h2>
          {file && (
            <p className="mt-1 font-mono text-[0.8125rem] text-muted-foreground">{file.name}</p>
          )}
          <div className="mt-6 h-[3px] w-full overflow-hidden border-2 border-border">
            <div className="ll-progress h-full bg-primary" />
          </div>
          <ul className="mt-6 space-y-2.5">
            {STEPS.map((l, i) => (
              <li
                key={l}
                className="ll-rise flex items-center gap-2.5 text-[0.9375rem] text-muted-foreground"
                style={{ animationDelay: `${0.2 + i * 0.4}s` }}
              >
                <span className="h-2 w-2 bg-primary" /> {l}
              </li>
            ))}
          </ul>
        </div>
      </main>
    );
  }

  if (report) {
    return (
      <main className="mx-auto w-full max-w-2xl px-5 py-10 sm:px-8 sm:py-14">
        {saved && (
          <p className="mb-4 text-center font-mono text-[0.6875rem] uppercase tracking-[0.1em] text-muted-foreground">
            ✓ Saved to your account
          </p>
        )}
        <LookoutReport report={report} filename={file?.name} />
        <div className="mt-8 text-center">
          <button
            type="button"
            onClick={() => pick(null)}
            className="ll-shadow-sm inline-flex items-center border-2 border-border bg-card px-4 py-2 font-display text-sm uppercase tracking-[0.01em] transition-transform hover:-translate-x-px hover:-translate-y-px"
          >
            Analyze another lease
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-2xl px-5 py-12 sm:px-8 sm:py-16">
      <div className="text-center">
        <span className="zine-tag">Intake</span>
        <h1 className="mt-4 font-display text-[clamp(2rem,4vw,2.75rem)] uppercase leading-[0.95] tracking-[-0.02em]">
          Let&apos;s read your lease.
        </h1>
        <p className="mt-3 text-[1rem] leading-relaxed text-muted-foreground">
          Drop the PDF and we&apos;ll check it against your state&apos;s landlord–tenant law.
        </p>
      </div>

      <form onSubmit={analyze} className="mt-10">
        <label
          htmlFor="lease-file"
          onDragOver={(e: DragEvent) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e: DragEvent) => {
            e.preventDefault();
            setDragOver(false);
            const f = e.dataTransfer.files?.[0];
            if (f) pick(f);
          }}
          className={`flex cursor-pointer flex-col items-center justify-center gap-4 border-[3px] border-dashed px-8 py-16 text-center transition-colors ${
            dragOver ? 'border-primary bg-primary/5' : 'border-border bg-card hover:bg-accent'
          }`}
        >
          <span className="inline-flex border-2 border-border bg-accent p-3 text-primary">
            {file ? (
              <FileText className="h-5 w-5" strokeWidth={2} />
            ) : (
              <Upload className="h-5 w-5" strokeWidth={2} />
            )}
          </span>
          {file ? (
            <p className="font-mono text-[0.9375rem]">{file.name}</p>
          ) : (
            <p className="font-display text-2xl uppercase tracking-[-0.01em]">
              Drop your lease here
            </p>
          )}
          <p className="font-mono text-[0.75rem] uppercase tracking-[0.06em] text-muted-foreground">
            PDF up to 20MB · we don&apos;t share it · CT &amp; NY
          </p>
          <input
            id="lease-file"
            type="file"
            accept="application/pdf,.pdf"
            className="sr-only"
            onChange={(e) => pick(e.target.files?.[0] ?? null)}
          />
        </label>

        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="jurisdiction"
              className="font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-muted-foreground"
            >
              State
            </label>
            <select
              id="jurisdiction"
              value={jurisdiction}
              onChange={(e) => setJurisdiction(e.target.value)}
              className="border-2 border-border bg-card px-3 py-2 font-mono text-[0.8125rem] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="auto">Auto-detect from the lease</option>
              {SUPPORTED_JURISDICTIONS.map((j) => (
                <option key={j.code} value={j.code}>
                  {j.label}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            disabled={!file}
            className="ll-shadow-sm inline-flex items-center justify-center border-2 border-border bg-primary px-5 py-2.5 font-display uppercase tracking-[0.01em] text-primary-foreground transition-transform hover:-translate-x-px hover:-translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-x-0 disabled:hover:translate-y-0"
          >
            Scan my lease →
          </button>
        </div>
      </form>

      {error && (
        <p className="mt-6 border-2 border-sev-unenforceable bg-sev-unenforceable-tint px-4 py-3 text-sm text-foreground">
          {error}
        </p>
      )}

      <p className="mt-10 text-center font-mono text-[0.6875rem] uppercase leading-5 tracking-[0.06em] text-muted-foreground">
        Not legal advice — we point you to the law so you can ask better questions.
      </p>
    </main>
  );
}
