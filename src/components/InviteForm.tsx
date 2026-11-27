'use client';

import { ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';

/**
 * Inline invite capture. Records the request (notifies us + acknowledges the
 * visitor via /invite-request) and hands the email to /login with signup prefilled
 * — the conversion seam for the invite-only beta.
 */
export function InviteForm({ className }: { className?: string }) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState(''); // honeypot — humans never see this

  function submit(e: FormEvent) {
    e.preventDefault();
    const value = email.trim();
    if (value) {
      // Best-effort; `keepalive` lets it finish through the navigation below.
      void fetch('/invite-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: value, company }),
        keepalive: true,
      }).catch(() => {});
    }
    router.push(value ? `/login?email=${encodeURIComponent(value)}` : '/login');
  }

  return (
    <form
      onSubmit={submit}
      className={`flex w-full max-w-md flex-col gap-2 sm:flex-row ${className ?? ''}`}
    >
      <label htmlFor="invite-email" className="sr-only">
        Email address for a beta invite
      </label>
      {/* Honeypot: off-screen, not for humans. Bots that fill it get silently dropped. */}
      <input
        type="text"
        name="company"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
      />
      <input
        id="invite-email"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@wesleyan.edu"
        autoComplete="email"
        className="min-w-0 flex-1 border-2 border-border bg-input-background px-3.5 py-2.5 text-[0.9375rem] outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />
      <button
        type="submit"
        className="inline-flex shrink-0 items-center justify-center gap-1.5 border-2 border-border bg-secondary shadow-[3px_3px_0_var(--primary)] px-5 py-2.5 font-display text-sm uppercase tracking-[0.01em] text-secondary-foreground transition-transform hover:-translate-x-px hover:-translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        Get an invite
        <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
      </button>
    </form>
  );
}
