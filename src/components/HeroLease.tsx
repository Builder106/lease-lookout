'use client';

import { ArrowUpRight } from 'lucide-react';
import {
  AnimatePresence,
  animate,
  motion,
  useAnimate,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useTransform,
} from 'motion/react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

import { SeverityPill } from '@/components/SeverityPill';

/* "The lens reads the lease."
 *
 * The document's gray bars are legalese; wherever the loupe sits, the glass
 * resolves them into actual words. The entrance is a read: the loupe tracks
 * the reading path line by line, catches on the hold-harmless clause (a
 * double-take), sees it red in the glass first, and then the redline ignites
 * outward from the lens onto the page; the verdict card springs up out of the
 * find. Idle, the loupe holds its post on the clause. On hover, the cursor
 * takes the loupe — whatever line you hold it over resolves in the glass, and
 * passing over the redline pulses the verdict.
 *
 * All geometry below is measured from the Blender scene (ortho camera
 * projection), in normalized document coordinates: x right, y down, 0..1 of
 * the square render. One pair of motion values (lens center) drives the
 * loupe, the glass content, the magnified backdrop, and band detection.
 */

type Pt = [number, number];
type Seg = [Pt, Pt];

const SEGS: Record<string, Seg> = {
  header: [
    [0.5443, 0.3033],
    [0.7139, 0.3927],
  ],
  line0: [
    [0.5192, 0.3171],
    [0.8076, 0.469],
  ],
  line1: [
    [0.4691, 0.3443],
    [0.7236, 0.4784],
  ],
  line2: [
    [0.419, 0.3716],
    [0.7159, 0.5279],
  ],
  redline: [
    [0.3689, 0.3984],
    [0.6318, 0.5369],
  ],
  line4: [
    [0.3187, 0.426],
    [0.6071, 0.5779],
  ],
  line5: [
    [0.2686, 0.4532],
    [0.5061, 0.5783],
  ],
};

/* Written for the glass: a ~100px circle fits ~3 short lines, so each snippet
 * is the clause's essence in ≤6 words, never the full sentence. */
const SNIPPETS: Record<string, string> = {
  header: 'RESIDENTIAL LEASE · 14 PP',
  line0: 'Rent due the first of the month',
  line1: 'Keep the premises clean',
  line2: 'Entry to inspect or repair',
  redline: '…hold the Landlord harmless…',
  line4: 'Tenant pays all utilities',
  line5: 'Governed by Connecticut law',
};

/* Loupe asset geometry (from the cropped render). */
const LOUPE_W = 0.2507; // loupe width / doc width
const LOUPE_H = 0.2653;
const LENS_IN_LOUPE: Pt = [0.3868, 0.3644]; // lens center within the loupe asset
const LENS_R = 0.08; // glass window radius / doc width (just inside the ring)
const ZOOM = 1.75;

const lerp = (s: Seg, t: number): Pt => [
  s[0][0] + (s[1][0] - s[0][0]) * t,
  s[0][1] + (s[1][1] - s[0][1]) * t,
];

const HOME = lerp(SEGS.redline, 0.5); // the post: centered on the clause

/* The reading path: down onto line 1, across it, down a line, across, skim,
 * then approach the clause, overshoot (the double-take), recoil, settle. */
const START: Pt = [lerp(SEGS.line0, 0.15)[0], lerp(SEGS.line0, 0.15)[1] - 0.16];
const WAYPOINTS: Pt[] = [
  START,
  lerp(SEGS.line0, 0.15),
  lerp(SEGS.line0, 0.7),
  lerp(SEGS.line1, 0.25),
  lerp(SEGS.line1, 0.75),
  lerp(SEGS.line2, 0.3),
  lerp(SEGS.line2, 0.55),
  lerp(SEGS.redline, 0.4),
  lerp(SEGS.redline, 0.62),
  lerp(SEGS.redline, 0.46),
  HOME,
];
const TIMES = [0, 0.13, 0.32, 0.38, 0.56, 0.62, 0.72, 0.8, 0.88, 0.94, 1];
const SCAN_SECONDS = 3.2;

function distToSeg([px, py]: Pt, [[ax, ay], [bx, by]]: Seg) {
  const dx = bx - ax,
    dy = by - ay;
  const len2 = dx * dx + dy * dy;
  const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / len2));
  const cx = ax + t * dx,
    cy = ay + t * dy;
  return Math.hypot(px - cx, py - cy);
}

function bandAt(p: Pt): string | null {
  let best: string | null = null;
  let bestD = 0.05; // beyond half a line-spacing: no text, just paper
  for (const [name, seg] of Object.entries(SEGS)) {
    const d = distToSeg(p, seg);
    if (d < bestD) {
      bestD = d;
      best = name;
    }
  }
  return best;
}

/* A reader's loupe rides the lines, it doesn't wander into margins: snap the
 * follow target to the nearest text line, with a little perpendicular give so
 * it feels magnetic rather than locked. Also keeps the lens on the page. */
function snapToLines(p: Pt): Pt {
  let bestD = Infinity;
  let bestProj: Pt = p;
  for (const [[ax, ay], [bx, by]] of Object.values(SEGS)) {
    const dx = bx - ax,
      dy = by - ay;
    const len2 = dx * dx + dy * dy;
    const t = Math.max(0.08, Math.min(0.92, ((p[0] - ax) * dx + (p[1] - ay) * dy) / len2));
    const proj: Pt = [ax + t * dx, ay + t * dy];
    const d = Math.hypot(p[0] - proj[0], p[1] - proj[1]);
    if (d < bestD) {
      bestD = d;
      bestProj = proj;
    }
  }
  const give = Math.min(1, 0.022 / Math.max(bestD, 1e-6));
  return [bestProj[0] + (p[0] - bestProj[0]) * give, bestProj[1] + (p[1] - bestProj[1]) * give];
}

const sleep = (s: number) => new Promise((r) => setTimeout(r, s * 1000));

type Stage = 'enter' | 'scan' | 'ignite' | 'watch';

export function HeroLease() {
  const reduce = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  // Reduced motion starts at the end of the story: lens parked, find made.
  const [stage, setStage] = useState<Stage>(reduce ? 'watch' : 'enter');
  const [inspecting, setInspecting] = useState(false);
  const [band, setBand] = useState<string | null>(null);
  const pulsedRef = useRef(false);

  const found = stage === 'ignite' || stage === 'watch';

  /* One source of truth: lens center in doc-normalized coords. */
  const lx = useMotionValue(reduce ? HOME[0] : START[0]);
  const ly = useMotionValue(reduce ? HOME[1] : START[1]);
  const lo = useMotionValue(reduce ? 1 : 0); // loupe opacity
  const ir = useMotionValue(reduce ? 1.3 : 0); // ignition radius, in doc units

  const sz = useMotionValue(0); // container px (square)
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => sz.set(e.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, [sz]);

  /* Derived placements — everything hangs off (lx, ly). */
  const loupeX = useTransform(() => (lx.get() - LOUPE_W * LENS_IN_LOUPE[0]) * sz.get());
  const loupeY = useTransform(() => (ly.get() - LOUPE_H * LENS_IN_LOUPE[1]) * sz.get());
  const glassX = useTransform(() => (lx.get() - LENS_R) * sz.get());
  const glassY = useTransform(() => (ly.get() - LENS_R) * sz.get());
  const glassD = useTransform(() => 2 * LENS_R * sz.get());
  /* Magnified backdrop: the doc itself, scaled, countertranslated so the
   * point under the lens center appears at the center of the glass. */
  const magX = useTransform(() => (LENS_R - lx.get() * ZOOM) * sz.get());
  const magY = useTransform(() => (LENS_R - ly.get() * ZOOM) * sz.get());
  const magW = useTransform(() => ZOOM * sz.get());
  const clip = useTransform(
    () =>
      `circle(${Math.max(ir.get(), 0) * sz.get()}px at ${HOME[0] * sz.get()}px ${HOME[1] * sz.get()}px)`
  );
  const glassFont = useTransform(() => `${Math.max(sz.get() * 0.0228, 10)}px`);

  useMotionValueEvent(lx, 'change', () => setBand(bandAt([lx.get(), ly.get()])));
  useMotionValueEvent(ly, 'change', () => setBand(bandAt([lx.get(), ly.get()])));

  /* The story: enter → scan (the reading) → ignite (the find) → watch. */
  useEffect(() => {
    if (reduce) return; // already initialized at the end state
    let cancelled = false;
    (async () => {
      await sleep(0.5); // let the document land
      if (cancelled) return;
      setStage('scan');
      animate(lo, 1, { duration: 0.45, ease: 'easeOut' });
      await Promise.all([
        animate(
          lx,
          WAYPOINTS.map((p) => p[0]),
          { duration: SCAN_SECONDS, times: TIMES, ease: 'easeInOut' }
        ),
        animate(
          ly,
          WAYPOINTS.map((p) => p[1]),
          { duration: SCAN_SECONDS, times: TIMES, ease: 'easeInOut' }
        ),
      ]);
      if (cancelled) return;
      setStage('ignite'); // the glass already shows it red — now the page learns
      animate(ir, 1.3, { duration: 0.55, ease: [0.4, 0, 0.2, 1] });
      await sleep(0.5);
      if (cancelled) return;
      setStage('watch');
    })();
    return () => {
      cancelled = true;
    };
  }, [reduce, lx, ly, lo, ir]);

  /* The watch: a slow drift along the clause — holding post, not bobbing. */
  useEffect(() => {
    if (stage !== 'watch' || inspecting || reduce) return;
    const drift = animate(lx, [null, HOME[0] + 0.009, HOME[0] - 0.009], {
      duration: 9,
      repeat: Infinity,
      repeatType: 'mirror',
      ease: 'easeInOut',
    });
    return () => drift.stop();
  }, [stage, inspecting, reduce, lx]);

  /* You look: the cursor takes the loupe (mouse only, once the find is made). */
  const onPointerMove = (e: React.PointerEvent) => {
    if (reduce || stage !== 'watch' || e.pointerType !== 'mouse') return;
    const r = containerRef.current?.getBoundingClientRect();
    if (!r) return;
    const [nx, ny] = snapToLines([(e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height]);
    if (!inspecting) setInspecting(true);
    animate(lx, nx, { type: 'spring', stiffness: 150, damping: 20 });
    animate(ly, ny, { type: 'spring', stiffness: 150, damping: 20 });
  };
  const onPointerLeave = () => {
    if (!inspecting) return;
    pulsedRef.current = false;
    // Spring home first; only then hand control back to the watch drift,
    // so the return isn't cut short by the idle loop.
    Promise.all([
      animate(lx, HOME[0], { type: 'spring', stiffness: 120, damping: 18 }),
      animate(ly, HOME[1], { type: 'spring', stiffness: 120, damping: 18 }),
    ]).then(() => setInspecting(false));
  };

  /* Pointing at the verdict sends the lens back to the evidence: the loupe
   * springs home to the clause the card cites, and the card acknowledges. */
  const onCardEnter = () => {
    if (reduce || stage !== 'watch') return;
    setInspecting(true);
    pulsedRef.current = true; // this pulse is ours; don't double-fire on arrival
    animate(lx, HOME[0], { type: 'spring', stiffness: 140, damping: 19 });
    animate(ly, HOME[1], { type: 'spring', stiffness: 140, damping: 19 });
    if (flagScope.current) {
      animateFlag(flagScope.current, { scale: [1, 1.03, 1] }, { duration: 0.4, ease: 'easeInOut' });
    }
  };

  /* Evidence ↔ verdict: holding the lens over the clause pulses the card. */
  const [flagScope, animateFlag] = useAnimate();
  useEffect(() => {
    if (inspecting && band === 'redline' && !pulsedRef.current) {
      pulsedRef.current = true;
      if (flagScope.current) {
        animateFlag(
          flagScope.current,
          { scale: [1, 1.035, 1] },
          { duration: 0.45, ease: 'easeInOut' }
        );
      }
    }
    if (band !== 'redline') pulsedRef.current = false;
  }, [inspecting, band, animateFlag, flagScope]);

  const snippet = band ? SNIPPETS[band] : null;
  const isRed = band === 'redline';

  return (
    <div className="relative pb-10 lg:pb-6" aria-hidden="true">
      <div
        ref={containerRef}
        className="ll-shadow relative cursor-crosshair border-2 border-border bg-card"
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
      >
        {/* The page: clean until the lens finds the clause; dips at the find. */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 26, scale: 0.985 }}
          animate={
            stage === 'ignite' && !reduce
              ? { opacity: 1, scale: 1, y: [0, 2.5, 0] }
              : { opacity: 1, scale: 1, y: 0 }
          }
          transition={
            stage === 'ignite'
              ? { duration: 0.5, ease: 'easeInOut' }
              : { type: 'spring', stiffness: 100, damping: 19 }
          }
          className="relative"
        >
          <Image
            src="/hero-doc-clean-3d.png"
            alt=""
            width={1500}
            height={1500}
            priority
            className="h-auto w-full select-none"
          />
          {/* The find, igniting outward from the lens. */}
          <motion.div className="absolute inset-0" style={{ clipPath: clip }}>
            <Image
              src="/hero-doc-3d.png"
              alt=""
              width={1500}
              height={1500}
              priority
              className="h-auto w-full select-none"
            />
          </motion.div>
        </motion.div>

        {/* The loupe. */}
        <motion.div
          className="absolute left-0 top-0"
          style={{
            x: loupeX,
            y: loupeY,
            width: `${LOUPE_W * 100}%`,
            opacity: lo,
            filter: 'drop-shadow(0 10px 14px rgba(35,33,30,0.18))',
          }}
        >
          <Image
            src="/hero-loupe-3d.png"
            alt=""
            width={376}
            height={398}
            priority
            className="h-auto w-full select-none"
          />
        </motion.div>

        {/* The glass: where legalese resolves into what it really says. */}
        <motion.div
          className="absolute left-0 top-0 overflow-hidden rounded-full"
          style={{ x: glassX, y: glassY, width: glassD, height: glassD, opacity: lo }}
        >
          {/* magnified page under the glass */}
          <motion.img
            src="/hero-doc-clean-3d.png"
            alt=""
            className="absolute left-0 top-0 max-w-none select-none"
            style={{ x: magX, y: magY, width: magW }}
          />
          <motion.img
            src="/hero-doc-3d.png"
            alt=""
            className="absolute left-0 top-0 max-w-none select-none"
            style={{ x: magX, y: magY, width: magW }}
            initial={false}
            animate={{ opacity: found || reduce ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          />
          {/* paper wash so the words read over the magnified bars */}
          <div className="absolute inset-0 rounded-full bg-card/75" />
          {/* the resolved text */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center px-[11%] text-center"
            style={{ fontSize: glassFont }}
          >
            <AnimatePresence mode="wait">
              {snippet && (
                <motion.p
                  key={band}
                  initial={{ opacity: 0, y: 4, filter: 'blur(2px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -4, filter: 'blur(2px)' }}
                  transition={{ duration: 0.22, ease: 'easeOut' }}
                  style={{ textWrap: 'balance' }}
                  className={
                    band === 'header'
                      ? 'font-mono text-[0.78em] uppercase leading-[1.5] tracking-[0.1em] text-muted-foreground'
                      : isRed
                        ? 'font-serif text-[1.15em] leading-[1.3] tracking-[-0.01em] text-foreground underline decoration-sev-unenforceable decoration-wavy decoration-2 underline-offset-[3px]'
                        : 'font-serif text-[1.1em] leading-[1.3] tracking-[-0.01em] text-foreground/80'
                  }
                >
                  {snippet}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>
          {/* glass edge + occasional glint while holding watch */}
          <div className="pointer-events-none absolute inset-0 rounded-full shadow-[inset_0_1px_6px_rgba(17,17,13,0.16),inset_0_0_0_1.5px_rgba(17,17,13,0.32)]" />
          {stage === 'watch' && !inspecting && !reduce && (
            <motion.div
              className="pointer-events-none absolute inset-y-0 w-1/4 rotate-[28deg] bg-gradient-to-r from-transparent via-white/45 to-transparent"
              initial={{ x: '-180%' }}
              animate={{ x: '420%' }}
              transition={{ duration: 1.2, ease: 'easeInOut', repeat: Infinity, repeatDelay: 5.5 }}
            />
          )}
        </motion.div>
      </div>

      {/* The verdict: springs up out of the find; pulses when your lens
          re-reads the clause; recedes while you inspect elsewhere. */}
      <motion.div
        ref={flagScope}
        className="ll-shadow absolute bottom-4 right-0 w-[18rem] max-w-[86%] origin-top-left border-2 border-border bg-card p-4 sm:right-2"
        style={{ pointerEvents: found || reduce ? 'auto' : 'none' }}
        onPointerEnter={onCardEnter}
        onPointerLeave={onPointerLeave}
        initial={reduce ? false : { opacity: 0, y: 14, scale: 0.92 }}
        animate={
          found || reduce ? { opacity: inspecting && !isRed ? 0.55 : 1, y: 0, scale: 1 } : undefined
        }
        transition={{ type: 'spring', stiffness: 280, damping: 24 }}
      >
        <SeverityPill severity="illegal" />
        <h3 className="mt-3 font-serif text-[1.15rem] leading-[1.2]">
          Landlord exculpation / hold-harmless
        </h3>
        <p className="mt-1.5 text-[0.8125rem] leading-snug text-muted-foreground">
          Connecticut doesn&apos;t let a lease waive the landlord&apos;s liability for its own
          negligence.
        </p>
        <span className="mt-3 inline-flex items-center gap-1 border-2 border-border bg-sev-info-tint px-2 py-1 font-mono text-[0.7rem] font-medium text-foreground">
          {'// '}Conn. Gen. Stat. § 47a-4(a)(3)
          <ArrowUpRight className="h-3 w-3" strokeWidth={2.5} />
        </span>
      </motion.div>
    </div>
  );
}
