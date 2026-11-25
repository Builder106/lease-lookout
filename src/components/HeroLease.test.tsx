import { describe, expect, it, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import React from 'react';
import { HeroLease } from './HeroLease';

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

describe('HeroLease component', () => {
  it('renders HeroLease loupe visual with document images and verdict', () => {
    const html = renderToStaticMarkup(<HeroLease />);
    expect(html).toContain('Landlord exculpation / hold-harmless');
    expect(html).toContain('Conn. Gen. Stat. § 47a-4(a)(3)');
  });
});
