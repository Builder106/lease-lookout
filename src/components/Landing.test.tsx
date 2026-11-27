import { describe, expect, it, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import React from 'react';
import { Landing, SiteHeader, SiteFooter } from './Landing';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock('motion/react', () => {
  const FakeMotion = ({
    children,
    className,
    style,
  }: {
    children?: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
    [key: string]: unknown;
  }) => (
    <div className={className} style={style}>
      {children}
    </div>
  );
  return {
    motion: {
      div: FakeMotion,
      p: FakeMotion,
      img: FakeMotion,
    },
    AnimatePresence: ({ children }: { children?: React.ReactNode }) => <>{children}</>,
    animate: vi.fn(),
    useAnimate: () => [{ current: null }, vi.fn()],
    useMotionValue: (val: unknown) => ({
      get: () => val,
      set: vi.fn(),
    }),
    useMotionValueEvent: vi.fn(),
    useReducedMotion: () => false,
    useTransform: (fn: unknown) => ({
      get: typeof fn === 'function' ? fn : () => fn,
    }),
  };
});

describe('Landing page components', () => {
  it('renders SiteHeader with navigation and brand links', () => {
    const html = renderToStaticMarkup(<SiteHeader />);
    expect(html).toContain('LeaseLookout home');
    expect(html).toContain('href="/walkthrough"');
    expect(html).toContain('How it works');
    expect(html).toContain('Examples');
    expect(html).toContain('What we check');
    expect(html).toContain('Sign in');
    expect(html).toContain('Get an invite');
  });

  it('renders SiteFooter with copyright and links', () => {
    const html = renderToStaticMarkup(<SiteFooter />);
    expect(html).toContain('Not legal advice.');
    expect(html).toContain('Privacy policy');
    expect(html).toContain('CT statutes (§47a)');
    expect(html).toContain('Source code (AGPL)');
    expect(html).toContain('Get an invite');
  });

  it('renders complete Landing page sections', () => {
    const html = renderToStaticMarkup(<Landing />);
    expect(html).toContain('Get your deposit');
    expect(html).toContain('Invite-only beta // Open source');
    expect(html).toContain('The asymmetry');
    expect(html).toContain('Move in to money back. No legalese.');
    expect(html).toContain('Real clauses from real CT leases.');
    expect(html).toContain('What we check for.');
    expect(html).toContain('Your lease is yours.');
    expect(html).toContain('Built first for renters around Wesleyan.');
  });
});
