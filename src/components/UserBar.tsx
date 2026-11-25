import Link from 'next/link';

import { Wordmark } from '@/components/BrandMark';

/** Sticky top bar for the authenticated app: brand + history + email + sign out. */
export function UserBar({ email }: { email: string }) {
  return (
    <header className="sticky top-0 z-20 border-b-2 border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-5xl items-center gap-6 px-5 sm:px-8">
        <Link
          href="/"
          className="rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Wordmark />
        </Link>
        <nav className="flex items-center gap-5">
          <Link
            href="/history"
            className="text-sm text-foreground/80 transition-colors hover:text-foreground"
          >
            My analyses
          </Link>
        </nav>
        <div className="ml-auto flex items-center gap-4">
          {email && (
            <span className="hidden text-[0.8125rem] text-muted-foreground sm:inline">{email}</span>
          )}
          <form action="/auth/signout" method="post">
            <button
              type="submit"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
