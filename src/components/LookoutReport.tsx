import { ArrowUpRight, ChevronRight, TriangleAlert } from 'lucide-react';

import { META, SeverityPill } from '@/components/SeverityPill';
import { labelForJurisdiction } from '@/lib/jurisdictions';
import type { Flag as FlagType, Report, Scope, Severity } from '@/lib/report-types';

const ORDER: Severity[] = ['illegal', 'questionable', 'info'];

/** Presentational report. Used by the live Analyzer (client) and the saved-history detail (server). */
export function LookoutReport({ report, filename }: { report: Report; filename?: string }) {
  if (report.meta.needs_ocr) {
    return (
      <section className="mx-auto w-full max-w-xl border-2 border-border bg-card ll-shadow p-8 text-center">
        <h2 className="font-display text-2xl uppercase">We couldn&apos;t read this PDF.</h2>
        <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted-foreground">
          It looks like a scanned image, not a text PDF. Export the lease as a text PDF and upload
          it again.
        </p>
      </section>
    );
  }

  const groups = ORDER.map(
    (s) => [s, report.flags.filter((f) => f.severity === s)] as const
  ).filter(([, fs]) => fs.length > 0);
  const total = report.flags.length;
  // If we couldn't confirm we ran the right law against this document, "0 flags" must
  // never read as a pass. The banner leads; the all-clear copy is neutralized.
  const scope = report.scope ?? null;
  const outOfScope = !!scope && scope.coverage !== 'covered';
  // The state whose law we actually read this against (for jurisdiction-aware copy).
  const stateLabel = scope?.analyzed_label ?? labelForJurisdiction(report.jurisdiction);

  return (
    <article className="mx-auto max-w-2xl">
      {outOfScope && <ScopeBanner scope={scope} />}
      <header className="border-b-2 border-border pb-7">
        {filename && <span className="zine-tag">Analysis // {filename}</span>}
        <h1 className="mt-4 font-display text-[2.75rem] uppercase leading-[0.95] tracking-[-0.02em]">
          {total === 0 ? (
            outOfScope ? (
              "We can't vouch for this one."
            ) : (
              'Nothing jumped out.'
            )
          ) : (
            <>
              <span className="text-primary">{total}</span> {total === 1 ? 'clause' : 'clauses'}{' '}
              worth a look.
            </>
          )}
        </h1>
        <p className="mt-3.5 max-w-[58ch] text-[0.9375rem] leading-relaxed text-muted-foreground">
          {total === 0
            ? outOfScope
              ? 'Zero flags here is not a clean bill of health — see the note above. We may not have read this against the law that actually governs it.'
              : `We didn't find clauses that clearly conflict with ${stateLabel} landlord–tenant law. That doesn't mean the lease is perfect — read it carefully, and ask about anything that feels off.`
            : `We read ${report.meta.pages} ${report.meta.pages === 1 ? 'page' : 'pages'} against ${stateLabel} law${report.meta.method === 'ocr' ? ' (via OCR)' : ''}. This isn't every possible issue — read the matched text and the receipts before you decide what to do.`}
        </p>

        {total > 0 && (
          <>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              {groups.map(([s, fs]) => (
                <span key={s} className="inline-flex items-center gap-2">
                  <SeverityPill severity={s} />
                  <span className="font-mono text-[0.8125rem] tabular text-muted-foreground">
                    ×{fs.length}
                  </span>
                </span>
              ))}
            </div>
            <p className="mt-5 inline-flex items-center gap-2 border-2 border-border bg-card px-3.5 py-2 font-mono text-[0.75rem] uppercase tracking-[0.06em] text-muted-foreground">
              Draft read · flagged by rule, not yet attorney-reviewed
            </p>
          </>
        )}
      </header>

      {groups.map(([s, fs]) => (
        <section key={s} className="mt-10">
          <div className="mb-4 flex items-center gap-3">
            <span className="font-mono text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-muted-foreground">
              {'// '}
              {META[s].label}
            </span>
            <span className="h-0.5 flex-1 bg-border opacity-20" />
            <span className="font-mono text-[0.75rem] tabular text-muted-foreground">
              {fs.length}
            </span>
          </div>
          <div className="space-y-5">
            {fs.map((f, i) => (
              <FlagCard key={f.rule_id} flag={f} delay={Math.min(i, 6) * 60} />
            ))}
          </div>
        </section>
      ))}

      <aside className="mt-9 border-2 border-border bg-card px-4 py-3 font-mono text-[0.75rem] uppercase leading-[1.7] tracking-[0.04em] text-muted-foreground">
        {report.disclaimer}
      </aside>
    </article>
  );
}

/** Leads the report when we can't confirm the ruleset matches the document — wrong
 * state, or institutional housing the statutes may not cover. Caution palette (yellow),
 * not a verdict (pink): it's "we can't speak to this," not "this is illegal." */
function ScopeBanner({ scope }: { scope: Scope }) {
  return (
    <aside className="ll-shadow mb-7 border-2 border-sev-check bg-sev-check-tint p-5 sm:p-6">
      <div className="flex items-center gap-2.5">
        <TriangleAlert className="h-5 w-5 shrink-0" strokeWidth={2.5} />
        <span className="font-mono text-[0.6875rem] font-bold uppercase tracking-[0.14em]">
          {'// '}Read this first
        </span>
      </div>
      <h2 className="mt-3 font-display text-[1.5rem] uppercase leading-[1.05] tracking-[-0.01em]">
        {scope.headline}
      </h2>
      <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-foreground">{scope.body}</p>
      {scope.citation && (
        <a
          href={scope.citation.url}
          target="_blank"
          rel="noreferrer noopener"
          className="mt-3.5 inline-flex items-center gap-1 border-2 border-border bg-card px-2.5 py-1 font-mono text-[0.75rem] font-medium text-foreground"
        >
          {'// '}
          {scope.citation.label} <ArrowUpRight className="h-3.5 w-3.5 shrink-0" strokeWidth={2.5} />
        </a>
      )}
      <p className="mt-3.5 font-mono text-[0.6875rem] uppercase tracking-[0.06em] text-muted-foreground">
        Checked against {scope.analyzed_label} law
        {scope.detected_label ? ` · reads like a ${scope.detected_label} document` : ''}
      </p>
    </aside>
  );
}

function FlagCard({ flag: f, delay }: { flag: FlagType; delay: number }) {
  return (
    <article
      className="ll-rise border-2 border-border bg-card ll-shadow p-5 sm:p-6"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between gap-3">
        <SeverityPill
          severity={f.severity}
          className="ll-stamp"
          style={{ animationDelay: `${delay + 240}ms` }}
        />
        <div className="flex items-center gap-2.5 font-mono text-[0.75rem] text-muted-foreground">
          {f.status === 'attorney-reviewed' && (
            <span className="border-2 border-border px-1.5 py-0.5 uppercase tracking-[0.04em]">
              reviewed
            </span>
          )}
          {f.page ? <span>p.&nbsp;{f.page}</span> : null}
        </div>
      </div>

      <h3 className="mt-4 font-serif text-[1.4rem] leading-[1.2]">{f.title}</h3>
      <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted-foreground">
        {f.tenant_explainer || f.description}
      </p>

      {f.matched_text && (
        <>
          <p className="eyebrow mt-[1.125rem]">In your lease</p>
          <blockquote className="mt-2 border-2 border-border bg-accent px-3.5 py-2.5 font-serif text-[1.0625rem] leading-[1.5]">
            “<span className="zine-strike">{f.matched_text}</span>”
          </blockquote>
        </>
      )}

      {f.citations.length > 0 && (
        <>
          <p className="eyebrow mt-[1.125rem]">Receipts</p>
          <div className="mt-2 space-y-2.5">
            {f.citations.map((c) => (
              <div key={c.url + c.label}>
                <a
                  href={c.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-1 border-2 border-border bg-sev-info-tint px-2.5 py-1 font-mono text-[0.75rem] font-medium text-foreground"
                >
                  {'// '}
                  {c.label} <ArrowUpRight className="h-3.5 w-3.5 shrink-0" strokeWidth={2.5} />
                </a>
                {c.quote && (
                  <details className="group mt-1.5">
                    <summary className="flex cursor-pointer list-none items-center gap-1 font-mono text-[0.75rem] uppercase tracking-[0.06em] text-muted-foreground hover:text-foreground [&::-webkit-details-marker]:hidden">
                      <ChevronRight
                        className="h-3.5 w-3.5 transition-transform duration-150 group-open:rotate-90"
                        strokeWidth={2.5}
                      />
                      Statute text
                    </summary>
                    <p className="mt-2 border-2 border-border bg-accent px-3.5 py-2.5 font-serif text-[0.9375rem] italic leading-[1.55] text-muted-foreground">
                      {c.quote}
                    </p>
                  </details>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </article>
  );
}
