'use client';

import { useEffect, useRef, useState } from 'react';

const PARTS = /^(\D*)(\d[\d.,]*)(.*)$/;

/**
 * Counts a numeric stat up from zero the first time it scrolls into view.
 * Progressive enhancement: the server renders the final `value`, so no-JS and
 * reduced-motion users just see it as-is. Non-numeric values (e.g. "§47a")
 * render static.
 */
export function CountUp({ value, durationMs = 1100 }: { value: string; durationMs?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const m = value.match(PARTS);
    const node = ref.current;
    if (!m || !node) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const [, prefix, numStr, suffix] = m;
    const target = parseFloat(numStr.replace(/,/g, ''));
    const decimals = numStr.includes('.') ? numStr.split('.')[1].length : 0;
    const fmt = (n: number) =>
      `${prefix}${n.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}${suffix}`;

    let raf = 0;
    let start = 0;
    // First frame (p≈0) renders 0, so the count starts from zero when it enters view.
    const tick = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / durationMs, 1);
      const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic — decelerate, no overshoot
      if (p < 1) {
        setDisplay(fmt(target * eased));
        raf = requestAnimationFrame(tick);
      } else {
        setDisplay(value); // snap to the exact final string
      }
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          raf = requestAnimationFrame(tick);
          io.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    io.observe(node);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, durationMs]);

  return <span ref={ref}>{display}</span>;
}
