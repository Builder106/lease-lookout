import {
  Ban,
  CalendarClock,
  Camera,
  FileSearch,
  KeyRound,
  Lock,
  Mail,
  Receipt,
  Scale,
  ShieldAlert,
  Upload,
  type LucideIcon,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { Wordmark } from '@/components/BrandMark';
import { CountUp } from '@/components/CountUp';
import { MiddletownFlag } from '@/components/MiddletownFlag';
import { HeroLease } from '@/components/HeroLease';
import { InviteForm } from '@/components/InviteForm';
import { SeverityPill } from '@/components/SeverityPill';
import type { Severity } from '@/lib/report-types';

// "/#…" (not "#…") so the header and footer also work from /privacy.
const NAV = [
  { href: '/#how', label: 'How it works' },
  { href: '/#examples', label: 'Examples' },
  { href: '/#checks', label: 'What we check' },
];

const SOURCE_URL = 'https://github.com/Builder106/lease-lookout';

const STEPS: { Icon: LucideIcon; title: string; body: string; live: boolean }[] = [
  {
    Icon: Camera,
    title: 'Record move-in',
    body: 'Walk through room by room and log existing damage with timestamped photos.',
    live: false,
  },
  {
    Icon: Upload,
    title: 'Check your lease',
    body: 'Upload the PDF and see which clauses may be illegal, each with the statute.',
    live: true,
  },
  {
    Icon: CalendarClock,
    title: 'Track the deadline',
    body: 'At move-out, see the date your landlord must return your deposit by.',
    live: false,
  },
  {
    Icon: Mail,
    title: 'Ask for it back',
    body: "If it doesn't come back, send a demand letter that cites the law.",
    live: false,
  },
];

const EXAMPLES: { severity: Severity; title: string; quote: string; statute: string }[] = [
  {
    severity: 'illegal',
    title: 'Landlord exculpation / hold-harmless',
    quote: '…hold the Landlord harmless and indemnify the Landlord against any and all claims…',
    statute: 'Conn. Gen. Stat. § 47a-4(a)(3)',
  },
  {
    severity: 'illegal',
    title: 'Security deposit over the legal limit',
    quote: "…a security deposit equal to three months' rent…",
    statute: 'Conn. Gen. Stat. § 47a-21(b)',
  },
  {
    severity: 'questionable',
    title: 'Late fee before the 9-day grace period',
    quote: '…a late fee of $50 shall apply if rent is not received by the 3rd of the month…',
    statute: 'Conn. Gen. Stat. § 47a-15a',
  },
];

const CHECKS: { Icon: LucideIcon; title: string; desc: string; cite: string }[] = [
  {
    Icon: Receipt,
    title: 'Security deposits',
    desc: 'Caps, interest, and the return window after you move out.',
    cite: '§ 47a-21',
  },
  {
    Icon: Ban,
    title: 'Illegal fees & charges',
    desc: 'Late fees before the grace period and disguised non-refundable fees.',
    cite: '§ 47a-4 · 15a',
  },
  {
    Icon: KeyRound,
    title: 'Entry & privacy',
    desc: 'Landlord entry without reasonable notice or at unreasonable hours.',
    cite: '§ 47a-16',
  },
  {
    Icon: ShieldAlert,
    title: 'Self-help eviction',
    desc: 'Lockouts or utility shutoffs in place of a court process.',
    cite: '§ 47a-4(a)',
  },
  {
    Icon: Scale,
    title: 'Waiving your rights',
    desc: 'Clauses that sign away protections the statute guarantees.',
    cite: '§ 47a-4',
  },
  {
    Icon: FileSearch,
    title: 'Repairs & habitability',
    desc: 'Shifting the duty to keep the unit livable onto the tenant.',
    cite: '§ 47a-7',
  },
];

const ICON_BOX =
  'inline-flex border-2 border-border bg-accent p-2 text-primary transition-transform duration-300 group-hover:-translate-y-0.5';

export function Landing() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <StatBand />
        <Problem />
        <HowItWorks />
        <Examples />
        <WhatWeCheck />
        <Privacy />
        <FinalCta />
      </main>
      <SiteFooter />
    </div>
  );
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b-2 border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link href="/" aria-label="LeaseLookout home">
          <Wordmark />
        </Link>
        <nav className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="transition-colors hover:text-foreground">
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Sign in
          </Link>
          <Link
            href="/#access"
            className="ll-shadow-sm hidden border-2 border-border bg-primary px-3.5 py-1.5 font-display text-[0.8125rem] uppercase tracking-[0.01em] text-primary-foreground transition-transform hover:-translate-x-px hover:-translate-y-px sm:inline-flex"
          >
            Get an invite
          </Link>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="mx-auto grid max-w-6xl items-center gap-12 px-5 pb-16 pt-14 sm:px-8 sm:pt-20 lg:grid-cols-[1.04fr_1fr] lg:gap-14">
      <div className="ll-rise">
        <span className="zine-tag">Invite-only beta // Open source</span>
        <h1 className="mt-5 font-display text-[clamp(2.6rem,5.6vw,4rem)] uppercase leading-[0.95] tracking-[-0.025em]">
          Get your deposit <span className="zine-highlight">back</span>.
        </h1>
        <p className="mt-5 max-w-[34rem] text-[1.0625rem] leading-relaxed text-muted-foreground">
          Record the apartment when you move in, know your landlord&apos;s legal deadline when you
          move out, and ask for your money with the statute in hand.
        </p>
        <p className="mt-7 font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-muted-foreground">
          CT: 21 days <span className="text-secondary">{'//'}</span> MA: 30 days{' '}
          <span className="text-secondary">{'//'}</span> every step cited
        </p>
        <div id="access" className="mt-8 scroll-mt-20">
          <InviteForm />
          <p className="mt-3 text-sm text-muted-foreground">
            No card, no spam. Just an invite when your spot opens. Or{' '}
            <a
              href="#how"
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              see how it works
            </a>
            .
          </p>
        </div>
      </div>
      <HeroLease />
    </section>
  );
}

function StatBand() {
  const stats = [
    { n: '21', label: 'days a Connecticut landlord has to return your deposit', count: true },
    { n: '30', label: 'days in Massachusetts, with a sworn list of any damages', count: true },
    { n: '100%', label: 'of flags cite primary law', count: true },
  ];
  return (
    <section className="border-y-2 border-border bg-primary text-primary-foreground">
      <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-14">
        <p className="font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-primary-foreground/70">
          {'// '}What LeaseLookout covers
        </p>
        <dl className="mt-6 grid gap-8 sm:grid-cols-3">
          {stats.map((s) => (
            <div key={s.label}>
              <dt className="tabular font-display text-[3.25rem] uppercase leading-none tracking-[-0.02em]">
                {s.count ? <CountUp value={s.n} /> : s.n}
              </dt>
              <dd className="mt-2 text-[0.9375rem] text-primary-foreground/80">{s.label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

function Problem() {
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="max-w-2xl">
          <span className="zine-tag">01 / The asymmetry</span>
          <h2 className="mt-4 font-display text-[clamp(1.85rem,3.6vw,2.6rem)] uppercase leading-[0.98] tracking-[-0.02em]">
            Landlords have enterprise software. You have a 50-page PDF and a pen.
          </h2>
          <p className="mt-5 text-[0.9375rem] leading-relaxed text-muted-foreground">
            Property managers run Yardi and AppFolio to optimize their side. Renters get a dense
            contract, and when the deposit doesn&apos;t come back, a lawyer costs more than the
            deposit. LeaseLookout is the counterweight: it keeps your records, tracks the deadline,
            and cites the law for you.
          </p>
        </div>

        <figure className="ll-rise relative mt-12 w-full">
          <Image
            src="/hero-asymmetry-2.png"
            alt="A single upright lease facing off across a gap against a towering stack of landlord enterprise software"
            width={1500}
            height={1035}
            className="h-auto w-full select-none"
          />

          {/* labels — absolutely placed over each element, theme-aware (md+) */}
          <div className="pointer-events-none absolute inset-0 hidden font-mono text-[0.6rem] uppercase leading-tight tracking-[0.1em] md:block lg:text-[0.7rem]">
            {/* the renter's side */}
            <div className="absolute left-0 top-[40%] w-[23%] text-right">
              <span className="inline-block border-2 border-border bg-card px-2 py-1 font-bold text-foreground shadow-[3px_3px_0_var(--shadow-color)]">
                Your 50-page lease →
              </span>
              <span className="mt-1.5 block text-muted-foreground">a dense PDF and a deadline</span>
            </div>

            {/* the landlord's side */}
            <div className="absolute left-[76%] top-[34%] w-[23%]">
              <span className="inline-block border-2 border-border bg-secondary px-2 py-1 font-bold text-secondary-foreground shadow-[3px_3px_0_var(--shadow-color)]">
                ← Enterprise software
              </span>
              <span className="mt-1.5 block text-muted-foreground">
                Yardi and AppFolio, on their side
              </span>
            </div>

            {/* the standoff */}
            <span className="absolute left-1/2 top-[14%] -translate-x-1/2 -rotate-6 border-2 border-border bg-card px-3 py-1 font-display text-xl tracking-normal text-foreground shadow-[3px_3px_0_var(--shadow-color)]">
              vs.
            </span>
          </div>

          {/* compact legend on small screens */}
          <figcaption className="mt-5 flex flex-wrap gap-x-5 gap-y-2 font-mono text-[0.7rem] uppercase tracking-[0.08em] text-muted-foreground md:hidden">
            <span className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 border-2 border-border bg-card" /> Your lease
            </span>
            <span className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 bg-secondary" /> Enterprise software
            </span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section id="how" className="border-b border-border">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        <span className="zine-tag">02 / How it works</span>
        <h2 className="mt-4 font-display text-[clamp(1.7rem,3.2vw,2.4rem)] uppercase leading-[0.98] tracking-[-0.02em]">
          Move in to money back. No legalese.
        </h2>
        <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <li key={s.title} className="group ll-card border-2 border-border bg-card p-6">
              <div className="flex items-center justify-between">
                <span className={ICON_BOX}>
                  <s.Icon className="h-5 w-5" strokeWidth={1.75} />
                </span>
                <span className="font-mono text-[0.75rem] text-muted-foreground">0{i + 1}</span>
              </div>
              <h3 className="mt-4 font-display text-lg uppercase tracking-[-0.01em]">{s.title}</h3>
              <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-muted-foreground">
                {s.body}
              </p>
              <p className="mt-3 font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-muted-foreground">
                {s.live ? 'Live for Connecticut' : 'In development'}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Examples() {
  return (
    <section id="examples" className="border-b border-border">
      <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8 sm:py-20">
        <span className="zine-tag">03 / Examples</span>
        <h2 className="mt-4 font-display text-[clamp(1.7rem,3.2vw,2.4rem)] uppercase leading-[0.98] tracking-[-0.02em]">
          Real clauses from real CT leases.
        </h2>
        <p className="mt-3 text-[0.9375rem] text-muted-foreground">
          A taste of what LeaseLookout surfaces. Every flag cites the actual statute.
        </p>
        <div className="mt-8 space-y-5">
          {EXAMPLES.map((e) => (
            <article key={e.title} className="ll-card border-2 border-border bg-card p-5 sm:p-6">
              <SeverityPill severity={e.severity} />
              <h3 className="mt-4 font-serif text-[1.3rem] leading-[1.2]">{e.title}</h3>
              <blockquote className="mt-3 border-2 border-border bg-accent px-3.5 py-2.5 font-serif text-[1.0625rem] leading-[1.5]">
                {e.quote}
              </blockquote>
              <a
                href="https://www.cga.ct.gov/current/pub/chap_830.htm"
                target="_blank"
                rel="noreferrer noopener"
                className="mt-4 inline-block border-2 border-border bg-sev-info-tint px-2.5 py-1 font-mono text-[0.75rem] font-medium text-foreground"
              >
                {'// '}
                {e.statute}
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhatWeCheck() {
  return (
    <section id="checks" className="border-b border-border">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        <span className="zine-tag">04 / Coverage</span>
        <h2 className="mt-4 font-display text-[clamp(1.7rem,3.2vw,2.4rem)] uppercase leading-[0.98] tracking-[-0.02em]">
          What we check for.
        </h2>
        <p className="mt-3 max-w-2xl text-[0.9375rem] text-muted-foreground">
          The ruleset is curated from the Connecticut General Statutes and grows as we add rules.
          Connecticut leases only, for now.
        </p>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {CHECKS.map((c) => (
            <div key={c.title} className="group ll-card border-2 border-border bg-card p-5">
              <span className={ICON_BOX}>
                <c.Icon className="h-5 w-5" strokeWidth={1.75} />
              </span>
              <h3 className="mt-3.5 font-display text-base uppercase tracking-[-0.01em]">
                {c.title}
              </h3>
              <p className="mt-1.5 text-[0.875rem] leading-relaxed text-muted-foreground">
                {c.desc}
              </p>
              <p className="mt-3.5 font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-muted-foreground transition-colors group-hover:text-secondary">
                CT · {c.cite}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Privacy() {
  return (
    <section className="border-b border-border">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-2 lg:gap-16">
        <div>
          <span className="zine-tag">Your data</span>
          <h2 className="mt-4 font-display text-[clamp(1.7rem,3.2vw,2.4rem)] uppercase leading-[0.98] tracking-[-0.02em]">
            Your lease is yours.
          </h2>
          <p className="mt-5 text-[0.9375rem] leading-relaxed text-muted-foreground">
            We don&apos;t sell your lease, share it, or train models on it. Each analysis is tied to
            your account, and only you can see your leases and their flags. The code and the rules
            are open source, so anyone can check our work.
          </p>
        </div>
        <div className="lg:pt-6">
          <div className="ll-shadow border-2 border-border bg-card p-6">
            <div className="flex items-center gap-2 text-primary">
              <Lock className="h-4 w-4" strokeWidth={2} />
              <span className="font-mono text-[0.6875rem] uppercase tracking-[0.14em]">
                Not legal advice
              </span>
            </div>
            <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted-foreground">
              Every flag cites the Connecticut statute, so you can read the law yourself instead of
              trusting us. LeaseLookout isn&apos;t a lawyer. For a specific situation, talk to a
              tenant-rights attorney or legal-aid clinic.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-3xl px-5 py-20 text-center sm:px-8">
        <MiddletownFlag className="mx-auto mb-7 w-[min(20rem,82%)]" />
        <span className="zine-tag">Built for Middletown</span>
        <h2 className="mt-4 font-display text-[clamp(1.85rem,3.6vw,2.6rem)] uppercase leading-[0.98] tracking-[-0.02em]">
          Built first for renters around Wesleyan.
        </h2>
        <p className="mt-5 text-[0.9375rem] leading-relaxed text-muted-foreground">
          Moving in or out somewhere in Connecticut? Get an invite and keep your deposit with the
          statute in hand.
        </p>
        <div className="mt-8 flex justify-center">
          <InviteForm />
        </div>
      </div>
    </section>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t-2 border-border bg-card">
      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Wordmark />
            <p className="mt-3 max-w-[16rem] text-[0.8125rem] leading-relaxed text-muted-foreground">
              Helping renters get their deposits back, cited to the law. Open source.
            </p>
          </div>
          <FooterCol
            title="Product"
            links={[
              { href: '/#how', label: 'How it works' },
              { href: '/#examples', label: 'Examples' },
              { href: '/#checks', label: 'What we check' },
              { href: '/login', label: 'Sign in' },
            ]}
          />
          <FooterCol
            title="Legal"
            links={[
              { href: '/privacy', label: 'Privacy policy' },
              {
                href: 'https://www.cga.ct.gov/current/pub/chap_830.htm',
                label: 'CT statutes (§47a)',
              },
              { href: SOURCE_URL, label: 'Source code (AGPL)' },
            ]}
          />
          <div>
            <h3 className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted-foreground">
              Get an invite
            </h3>
            <p className="mt-3 text-[0.8125rem] text-muted-foreground">
              Invite-only while in beta.
            </p>
            <div className="mt-3">
              <InviteForm />
            </div>
          </div>
        </div>

        <div className="mt-12 border-t-2 border-border pt-6">
          <p className="max-w-3xl text-[0.75rem] leading-relaxed text-muted-foreground">
            <span className="font-medium text-foreground/80">Not legal advice.</span> LeaseLookout
            is not a law firm and does not provide legal advice; its analysis is not a substitute
            for a licensed attorney. For a specific situation, contact a tenant-rights attorney or
            legal-aid clinic. Connecticut leases only, for now. Invite-only beta.
          </p>
          <p className="mt-4 font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-muted-foreground">
            © {new Date().getFullYear()} LeaseLookout
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div>
      <h3 className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted-foreground">
        {title}
      </h3>
      <ul className="mt-3 space-y-2 text-[0.875rem]">
        {links.map((l) => {
          const isAnchor = l.href.startsWith('#');
          const isExternal = l.href.startsWith('http');
          const className = 'text-muted-foreground transition-colors hover:text-foreground';
          return (
            <li key={l.href + l.label}>
              {isExternal ? (
                <a href={l.href} target="_blank" rel="noreferrer noopener" className={className}>
                  {l.label}
                </a>
              ) : isAnchor ? (
                <a href={l.href} className={className}>
                  {l.label}
                </a>
              ) : (
                <Link href={l.href} className={className}>
                  {l.label}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
