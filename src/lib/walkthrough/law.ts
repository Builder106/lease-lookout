// Plain-language law lines for the walkthrough. Every line names the curated
// rule it summarizes; the citation (label and link) is read from rules/, never
// written here, so the page can only cite what the ruleset already cites.
import ctDeductions from '../../../rules/ct/deposit-deductions.json';
import ctEntry from '../../../rules/ct/entry.json';
import ctRepairs from '../../../rules/ct/repairs.json';
import ctUtilities from '../../../rules/ct/utilities.json';
import maDeposit from '../../../rules/ma/security-deposit.json';
import maEntry from '../../../rules/ma/entry.json';

import type { RoomId } from '@/lib/walkthrough/rooms';

export type StateCode = 'ct' | 'ma';

type RuleFile = { rules: { id: string; citations: { label: string; url: string }[] }[] };
const FILES = [ctDeductions, ctEntry, ctRepairs, ctUtilities, maDeposit, maEntry] as RuleFile[];

export type Citation = { label: string; url: string };

/** First citation of a curated rule, with the label cut before any explanatory dash. */
export function citation(ruleId: string): Citation {
  const rule = FILES.flatMap((f) => f.rules).find((r) => r.id === ruleId);
  const first = rule?.citations[0];
  if (!first) throw new Error(`No curated citation for ${ruleId}`);
  return { label: first.label.split(' —')[0].trim(), url: first.url };
}

export type DepositState = {
  code: StateCode;
  name: string;
  /** Days after the tenancy ends that the landlord has to return the deposit. */
  days: number;
  /** The extra condition the statute adds, in plain words. */
  detail: string;
  ruleId: string;
};

export const DEPOSIT_STATES: Record<StateCode, DepositState> = {
  ct: {
    code: 'ct',
    name: 'Connecticut',
    days: 21,
    detail: 'or 15 days after you give a forwarding address in writing, whichever is later',
    ruleId: 'ct-deposit-004',
  },
  ma: {
    code: 'ma',
    name: 'Massachusetts',
    days: 30,
    detail: 'with a sworn, itemized list for anything they keep',
    ruleId: 'ma-deposit-004',
  },
};

type Line = { text: string; ruleId: string };

const ROOM_LAW: Record<StateCode, Record<RoomId, Line>> = {
  ct: {
    entry: {
      text: 'Your landlord has to give reasonable notice before coming in, except in an emergency.',
      ruleId: 'ct-entry-001',
    },
    kitchen: {
      text: 'Normal wear and tear cannot come out of your deposit, only damage you caused.',
      ruleId: 'ct-deposit-004',
    },
    living: {
      text: 'Repairs that keep the place livable are your landlord’s job, not yours.',
      ruleId: 'ct-repairs-001',
    },
    bathroom: {
      text: 'Your landlord cannot cut off heat, hot water or other essential services to pressure you.',
      ruleId: 'ct-utilities-001',
    },
    bedroom: {
      text: 'Routine repainting and cleaning are not damage, so they cannot be charged to your deposit.',
      ruleId: 'ct-deposit-004',
    },
  },
  ma: {
    entry: {
      text: 'Your landlord can enter only to inspect, repair or show the place, not whenever they like.',
      ruleId: 'ma-entry-001',
    },
    kitchen: {
      text: 'Anything kept for damage needs a sworn, itemized list within 30 days.',
      ruleId: 'ma-deposit-004',
    },
    living: {
      text: 'Anything kept for damage needs a sworn, itemized list within 30 days.',
      ruleId: 'ma-deposit-004',
    },
    bathroom: {
      text: 'Anything kept for damage needs a sworn, itemized list within 30 days.',
      ruleId: 'ma-deposit-004',
    },
    bedroom: {
      text: 'Anything kept for damage needs a sworn, itemized list within 30 days.',
      ruleId: 'ma-deposit-004',
    },
  },
};

export function roomLaw(state: StateCode, room: RoomId): { text: string; cite: Citation } {
  const line = ROOM_LAW[state][room];
  return { text: line.text, cite: citation(line.ruleId) };
}

export function returnDeadline(state: StateCode): DepositState & { cite: Citation } {
  const s = DEPOSIT_STATES[state];
  return { ...s, cite: citation(s.ruleId) };
}

/** Whole dollars from what a tenant types ("$1,450", "1450.00"); null when it is not an amount. */
export function parseAmount(input: string): number | null {
  const n = Number(input.replace(/[$,\s]/g, ''));
  return Number.isFinite(n) && n > 0 ? Math.round(n) : null;
}

export function formatDollars(n: number): string {
  return `$${n.toLocaleString('en-US')}`;
}

export const SAMPLE_CHARGE = { room: 'living' as RoomId, amount: 180, item: 'scuffed wall' };
