// LeaseLookout mark: a house fused with a fire-lookout — a little dwelling (pitched
// roof, doorway) raised on the lookout's splayed legs + deck, with a pennant on the
// peak = the redlined clause it caught. Rendered in the "Know Your Rights" neobrutalist
// language: solid fills, chunky ink outlines, no glow. Theme-adaptive — outlines + legs
// use currentColor (ink on paper, paper on dark); the structure is the electric-blue
// "--secondary" ink; the door is a cutout to the "--background" stock; the alarm pennant
// is the hot-pink "--primary" ink. So the whole mark flips with light/dark like the site.
export function BrandMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M11.5 21L8 29" stroke="currentColor" strokeWidth={3} />
      <path d="M20.5 21L24 29" stroke="currentColor" strokeWidth={3} />
      <rect
        x="7"
        y="18.2"
        width="18"
        height="3.4"
        rx="0.8"
        fill="var(--secondary)"
        stroke="currentColor"
        strokeWidth={1.7}
      />
      <rect
        x="10.6"
        y="11"
        width="10.8"
        height="7.6"
        rx="0.6"
        fill="var(--secondary)"
        stroke="currentColor"
        strokeWidth={1.7}
      />
      <path
        d="M16 5.4L23.5 11.5L8.5 11.5Z"
        fill="var(--secondary)"
        stroke="currentColor"
        strokeWidth={1.7}
      />
      <path
        d="M14.3 18.55L14.3 15.2Q14.3 13.8 16 13.8Q17.7 13.8 17.7 15.2L17.7 18.55Z"
        fill="var(--background)"
        stroke="currentColor"
        strokeWidth={0.9}
      />
      <path d="M16 5.6L16 1.2" stroke="currentColor" strokeWidth={2.1} />
      <path
        d="M16 1.4L22.5 3.3L16 5.2Z"
        fill="var(--primary)"
        stroke="currentColor"
        strokeWidth={1.3}
      />
    </svg>
  );
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className ?? ''}`}>
      <BrandMark className="h-[22px] w-[22px]" />
      <span className="font-display text-[1.05rem] uppercase tracking-[-0.01em]">
        Lease<span className="text-primary">Lookout</span>
      </span>
    </span>
  );
}
