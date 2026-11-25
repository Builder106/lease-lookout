// Jurisdictions the upload picker offers. Mirrors the ruleset folders under rules/
// and engine/scope.py JURISDICTIONS. The API (api/analyze.py) is the source of truth
// for validation — it only honors a code we actually have a ruleset for — so this list
// just drives the picker UI. Keep it in sync when a state ruleset is added.
export type JurisdictionOption = { code: string; label: string };

export const SUPPORTED_JURISDICTIONS: JurisdictionOption[] = [
  { code: 'ct', label: 'Connecticut' },
  { code: 'me', label: 'Maine' },
  { code: 'ma', label: 'Massachusetts' },
  { code: 'nh', label: 'New Hampshire' },
  { code: 'ny', label: 'New York' },
  { code: 'ri', label: 'Rhode Island' },
  { code: 'vt', label: 'Vermont' },
];

const LABELS: Record<string, string> = Object.fromEntries(
  SUPPORTED_JURISDICTIONS.map((j) => [j.code, j.label])
);

/** Human label for a jurisdiction code; "your state" when unknown/undefined. */
export function labelForJurisdiction(code: string | undefined | null): string {
  if (!code || code === 'auto') return 'your state';
  return LABELS[code] ?? code.toUpperCase();
}
