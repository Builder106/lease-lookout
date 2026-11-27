import type { Metadata } from 'next';

import { SiteFooter, SiteHeader } from '@/components/Landing';

export const metadata: Metadata = {
  title: 'Privacy policy — LeaseLookout',
  description:
    "What LeaseLookout collects when you upload a lease, where it's stored, who processes it, and how to get it deleted.",
};

const PROVIDERS: { name: string; role: string }[] = [
  { name: 'Vercel', role: 'Hosts and serves the application.' },
  { name: 'Supabase', role: 'Sign-in, database, and file storage for your account and analyses.' },
  { name: 'Plunk', role: 'Sends access-request email.' },
  {
    name: 'Google (Firebase)',
    role: 'Describes move-in photos in the cloud when your device cannot, through the Gemini API, and checks that requests come from this site.',
  },
  { name: 'Sinch Mailgun', role: 'Currently relays Supabase Auth account email.' },
  { name: 'Cloudflare', role: 'Domain registration and DNS.' },
];

function Section({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <section className="mt-12">
      <span className="eyebrow">{n}</span>
      <h2 className="mt-2 font-serif text-[clamp(1.35rem,2.4vw,1.75rem)] leading-tight tracking-[-0.02em]">
        {title}
      </h2>
      <div className="mt-3 space-y-3 text-[0.9375rem] leading-relaxed text-muted-foreground">
        {children}
      </div>
    </section>
  );
}

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-5 pb-20 pt-14 sm:px-8 sm:pt-20">
          <span className="eyebrow">Legal</span>
          <h1 className="mt-4 font-serif text-[clamp(2.25rem,4.5vw,3rem)] leading-[1.06] tracking-[-0.025em]">
            Privacy policy
          </h1>
          <p className="mt-4 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted-foreground">
            Effective November 26, 2026
          </p>
          <p className="mt-6 text-[1.0625rem] leading-relaxed text-muted-foreground">
            LeaseLookout reads your lease against Connecticut housing law. Doing that means you
            trust us with one of your more personal documents, so this page says exactly what we
            collect, where it lives, and what we will and won&apos;t do with it.
          </p>

          <Section n="01 — What we collect" title="Only what the service needs.">
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <span className="text-foreground">Your account.</span> An email address and a
                password. Passwords are handled by our sign-in provider and stored only as a salted
                hash — we never see them.
              </li>
              <li>
                <span className="text-foreground">Your lease.</span> The PDF you upload, the text we
                extract from it, and the report we generate — the flagged clauses, their severity,
                and the statute citations.
              </li>
              <li>
                <span className="text-foreground">Move-in photos.</span> The walkthrough keeps your
                photos and notes in your own browser; we don&apos;t store them. When your device
                can&apos;t describe a photo itself, the photo and your note are sent to
                Google&apos;s Gemini API to be described.
              </li>
              <li>
                <span className="text-foreground">Invite requests.</span> The email you give us when
                you ask for an invite.
              </li>
              <li>
                <span className="text-foreground">Operational logs.</span> Standard server logs (IP
                address, browser type, request timestamps) kept by our hosting provider for security
                and debugging.
              </li>
            </ul>
            <p>
              That&apos;s the whole list. No advertising trackers and no third-party analytics
              cookies — the only cookies we set are the ones that keep you signed in.
            </p>
          </Section>

          <Section n="02 — How we use it" title="To read your lease. Not to monetize it.">
            <p>
              We use your data to run the analysis, show you your report and history, keep the
              service secure, and send the email you asked for — an invite, or messages about your
              account.
            </p>
            <p>
              <span className="text-foreground">We don&apos;t sell your data.</span> We don&apos;t
              share your lease with landlords, brokers, advertisers, or anyone else. We don&apos;t
              use your documents to train AI models — the analysis is deterministic software running
              on our own infrastructure, and your lease is never sent to a third-party AI service.
            </p>
          </Section>

          <Section n="03 — Where it lives" title="Encrypted, access-controlled, in the U.S.">
            <p>
              Your account, leases, and reports are stored with Supabase (database and file storage)
              in the United States (AWS us-east-1). Every analysis is tied to your account under
              row-level security, so only you can read your leases and their flags. Data is
              encrypted in transit (TLS) and at rest by our infrastructure providers.
            </p>
          </Section>

          <Section n="04 — Service providers" title="Who processes data on our behalf.">
            <ul className="list-disc space-y-2 pl-5">
              {PROVIDERS.map((p) => (
                <li key={p.name}>
                  <span className="text-foreground">{p.name}.</span> {p.role}
                </li>
              ))}
            </ul>
            <p>Each provider processes only what it needs to do its job for us.</p>
          </Section>

          <Section n="05 — Retention & deletion" title="Yours until you say otherwise.">
            <p>
              We keep your leases and reports while your account is active so your history works.
              Email{' '}
              <a
                href="mailto:privacy@leaselookout.com"
                className="text-foreground underline-offset-4 hover:underline"
              >
                privacy@leaselookout.com
              </a>{' '}
              and we&apos;ll delete your account and every analysis tied to it within 30 days. If
              you only asked for an invite, we&apos;ll remove your email from the list on request.
            </p>
          </Section>

          <Section n="06 — Your rights" title="Ask, and we'll show you.">
            <p>
              You can request a copy of the data we hold about you, ask us to correct it, or ask us
              to delete it — use the email above. We&apos;ll respond within 30 days.
            </p>
          </Section>

          <Section n="07 — Children" title="Adults only.">
            <p>
              Leases are adult contracts, and LeaseLookout isn&apos;t directed at children under 13.
              We don&apos;t knowingly collect their data.
            </p>
          </Section>

          <Section n="08 — Not legal advice" title="The standing disclaimer applies here too.">
            <p>
              LeaseLookout is not a law firm, and nothing it produces — or anything in this policy —
              is legal advice or creates an attorney–client relationship. Every flag cites the
              Connecticut statute so you can read the law yourself; for a specific situation, talk
              to a tenant-rights attorney or legal-aid clinic.
            </p>
          </Section>

          <Section n="09 — Changes" title="We'll keep this page honest.">
            <p>
              If this policy changes, we&apos;ll update it here and revise the effective date. If a
              change is material, we&apos;ll email account holders before it takes effect.
            </p>
          </Section>

          <Section n="10 — Contact" title="One address, a human reads it.">
            <p>
              Questions, requests, complaints:{' '}
              <a
                href="mailto:privacy@leaselookout.com"
                className="text-foreground underline-offset-4 hover:underline"
              >
                privacy@leaselookout.com
              </a>
              .
            </p>
          </Section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
