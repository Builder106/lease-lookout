import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

import { UserBar } from '@/components/UserBar';
import { createClient } from '@/lib/supabase/server';
import type { Report } from '@/lib/report-types';

type Row = {
  id: string;
  created_at: string;
  filename: string | null;
  method: string | null;
  pages: number | null;
  flag_count: number;
  report: Report;
};

export default async function History() {
  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  const email = (claimsData?.claims?.email as string) ?? '';

  // RLS scopes this to the signed-in user's rows only.
  const { data } = await supabase
    .from('analyses')
    .select('id, created_at, filename, method, pages, flag_count, report')
    .order('created_at', { ascending: false });
  const rows = (data ?? []) as Row[];

  return (
    <>
      <UserBar email={email} />
      <main className="mx-auto w-full max-w-3xl px-5 py-10 sm:px-8 sm:py-14">
        <header className="mb-7">
          <span className="zine-tag">Docket // your leases</span>
          <h1 className="mt-4 font-display text-[2rem] uppercase leading-[0.95] tracking-[-0.02em]">
            My analyses
          </h1>
          <p className="mt-2 text-[0.9375rem] text-muted-foreground">
            Everything you&apos;ve uploaded. Click a row to re-read the report.
          </p>
        </header>

        {rows.length === 0 ? (
          <div className="ll-shadow border-2 border-border bg-card px-5 py-8 text-[0.9375rem] leading-relaxed text-muted-foreground">
            No analyses yet.{' '}
            <Link
              href="/"
              className="font-medium text-foreground underline underline-offset-4 hover:text-primary"
            >
              Analyze a lease
            </Link>{' '}
            to get started.
          </div>
        ) : (
          <ul className="ll-shadow divide-y-2 divide-border border-2 border-border bg-card">
            {rows.map((r) => {
              const unenforceable = r.report.flags.filter((f) => f.severity === 'illegal').length;
              const check = r.report.flags.filter((f) => f.severity === 'questionable').length;
              return (
                <li key={r.id}>
                  <Link
                    href={`/history/${r.id}`}
                    className="flex items-center gap-4 px-4 py-4 transition-colors hover:bg-accent sm:px-5"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-serif text-[1.1rem]">
                        {r.filename ?? 'lease.pdf'}
                      </p>
                      <p className="mt-0.5 font-mono text-[0.75rem] uppercase tracking-[0.04em] text-muted-foreground">
                        {new Date(r.created_at).toLocaleDateString()} · {r.pages ?? '?'} pages
                        {r.method === 'ocr' ? ' · OCR' : ''}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {unenforceable > 0 && (
                        <span className="border-2 border-border bg-sev-unenforceable px-2 py-0.5 font-mono text-[0.6875rem] font-bold text-[#11110d]">
                          {unenforceable} 🚩
                        </span>
                      )}
                      {check > 0 && (
                        <span className="border-2 border-border bg-sev-check px-2 py-0.5 font-mono text-[0.6875rem] font-bold text-[#11110d]">
                          {check} 👀
                        </span>
                      )}
                      {unenforceable === 0 && check === 0 && (
                        <span className="font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-muted-foreground">
                          clean ✓
                        </span>
                      )}
                    </div>
                    <ChevronRight
                      className="h-4 w-4 shrink-0 text-muted-foreground"
                      strokeWidth={2.5}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </main>
    </>
  );
}
