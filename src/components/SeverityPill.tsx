import { Eye, Flag, Info } from 'lucide-react';
import type { CSSProperties } from 'react';

import type { Severity } from '@/lib/report-types';

export const META: Record<Severity, { label: string; cls: string; Icon: typeof Flag }> = {
  illegal: { label: "Won't hold up", cls: 'is-illegal', Icon: Flag },
  questionable: { label: 'Worth a look', cls: 'is-check', Icon: Eye },
  info: { label: 'Good to know', cls: 'is-info', Icon: Info },
};

/** Rotated rubber-stamp verdict — the zine's signature severity marker. */
export function SeverityPill({
  severity,
  className,
  style,
}: {
  severity: Severity;
  className?: string;
  style?: CSSProperties;
}) {
  const m = META[severity] ?? META.info;
  const Icon = m.Icon;
  return (
    <span style={style} className={`stamp ${m.cls} ${className ?? ''}`}>
      <Icon className="h-3.5 w-3.5" strokeWidth={2.5} /> {m.label}
    </span>
  );
}
