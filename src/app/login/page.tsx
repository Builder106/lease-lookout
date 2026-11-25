'use client';

import { Suspense, useState, type FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

import { Wordmark } from '@/components/BrandMark';
import { createClient } from '@/lib/supabase/client';

function LoginForm() {
  const router = useRouter();
  // Arriving from the landing "Get an invite" form: prefill the email + open signup.
  const invited = useSearchParams().get('email');
  const [mode, setMode] = useState<'signin' | 'signup'>(invited ? 'signup' : 'signin');
  const [email, setEmail] = useState(invited ?? '');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setNotice(null);
    const supabase = createClient();
    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setNotice('Account created. Check your email to confirm, then sign in.');
        setMode('signin');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push('/');
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  const fieldLabel =
    'mb-1.5 block font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-muted-foreground';
  const fieldInput =
    'w-full border-2 border-border bg-input-background px-3 py-2.5 text-[0.9375rem] outline-none focus-visible:ring-2 focus-visible:ring-ring';

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex h-14 items-center border-b-2 border-border px-5 sm:px-8">
        <Link href="/" aria-label="LeaseLookout home">
          <Wordmark />
        </Link>
      </header>
      <main className="grid flex-1 place-items-center px-5 py-12">
        <div className="w-full max-w-sm">
          <div className="ll-shadow border-2 border-border bg-card p-7 sm:p-8">
            <span className="zine-tag">{mode === 'signin' ? 'Sign in' : 'Request access'}</span>
            <h1 className="mt-4 font-display text-[1.9rem] uppercase leading-[0.95] tracking-[-0.02em]">
              {mode === 'signin' ? 'Welcome back.' : 'Create your account.'}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">Invite-only while in beta.</p>

            <form onSubmit={submit} className="mt-7 space-y-4">
              <div>
                <label htmlFor="email" className={fieldLabel}>
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@wesleyan.edu"
                  autoComplete="email"
                  className={fieldInput}
                />
              </div>
              <div>
                <label htmlFor="password" className={fieldLabel}>
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                  className={fieldInput}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="ll-shadow-sm inline-flex w-full items-center justify-center border-2 border-border bg-primary px-4 py-2.5 font-display uppercase tracking-[0.01em] text-primary-foreground transition-transform hover:-translate-x-px hover:-translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
              >
                {loading ? 'Working…' : mode === 'signin' ? 'Sign in' : 'Create account'}
              </button>
            </form>

            {error && (
              <p className="mt-4 border-2 border-sev-unenforceable bg-sev-unenforceable-tint px-3 py-2 text-sm text-foreground">
                {error}
              </p>
            )}
            {notice && (
              <p className="mt-4 border-2 border-secondary bg-sev-info-tint px-3 py-2 text-sm text-foreground">
                {notice}
              </p>
            )}
          </div>

          <p className="mt-5 text-center text-sm text-muted-foreground">
            {mode === 'signin' ? 'New here? ' : 'Already have an account? '}
            <button
              type="button"
              onClick={() => {
                setMode(mode === 'signin' ? 'signup' : 'signin');
                setError(null);
                setNotice(null);
              }}
              className="font-medium text-foreground underline underline-offset-4 hover:text-primary"
            >
              {mode === 'signin' ? 'Request access' : 'Sign in'}
            </button>
          </p>
        </div>
      </main>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
