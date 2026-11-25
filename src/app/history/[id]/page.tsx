import Link from 'next/link';
import { notFound } from 'next/navigation';

import { LookoutReport } from '@/components/LookoutReport';
import { UserBar } from '@/components/UserBar';
import { createClient } from '@/lib/supabase/server';
import type { Report } from '@/lib/report-types';

export default async function AnalysisDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  const email = (claimsData?.claims?.email as string) ?? '';

  // RLS ensures a row for someone else's id simply returns nothing -> notFound.
  const { data: row } = await supabase
    .from('analyses')
    .select('filename, created_at, report')
    .eq('id', id)
    .maybeSingle();

  if (!row) notFound();
  const report = row.report as Report;

  return (
    <>
      <UserBar email={email} />
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-5 py-10">
        <div className="flex flex-col gap-1.5">
          <Link
            href="/history"
            className="font-mono text-[0.75rem] uppercase tracking-[0.08em] text-muted-foreground transition-colors hover:text-foreground"
          >
            ← My analyses
          </Link>
          <h1 className="font-serif text-[1.6rem] leading-[1.15]">
            {(row.filename as string) ?? 'lease.pdf'}
          </h1>
          <span className="font-mono text-[0.75rem] uppercase tracking-[0.04em] text-muted-foreground">
            {new Date(row.created_at as string).toLocaleString()}
          </span>
        </div>
        <LookoutReport report={report} />
      </main>
    </>
  );
}
