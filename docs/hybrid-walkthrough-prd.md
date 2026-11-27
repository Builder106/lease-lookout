# Walkthrough: move-in evidence that works without Wi-Fi

Product requirements for the LeaseLookout entry to #BuildHybridAI 2026 (Firebase AI Logic hybrid inference). Submission deadline: November 30, 2026, 5:00 pm Eastern. Platform: Web (Chrome).

## The problem

Most security deposit fights come down to one question: was the damage already there when the tenant moved in? Tenants who can answer it with dated photos usually win. Most tenants can't, because the best moment to record the apartment is move-in day, and on move-in day the internet usually isn't connected yet.

Months later the landlord sends a list of deductions. The tenant now has to match each charge against photos they may or may not have taken, under a legal deadline they probably don't know about.

## What we're building

A public page at `/walkthrough` with three steps.

1. **Record move-in, offline.** The tenant walks room by room, takes a photo, and adds an optional note. The model describes the condition of what's in the photo (scuffs, stains, cracks, missing parts) as a structured entry with a timestamp. This runs on the device, so it works with no connection. If the device has no local model and no connection, the photo is saved and described later.
2. **Clean the landlord's letter before anything is uploaded.** At move-out the tenant pastes the landlord's list of deductions. The page removes contact details, account numbers, and common street-address formats in the browser. The tenant reviews and can edit the cleaned version before any comparison. The original letter is never sent to the cloud.
3. **Match each charge to the evidence.** The cleaned deduction list and the saved move-in condition descriptions go to the cloud model, which needs the longer context. For each charge it reports what the move-in record shows: already there, not recorded at move-in, or unclear. Photos stay in the browser. The page then shows the return deadline for the tenant's state and the statute, quoted from `rules/`.

Every AI result shows where it ran ("on this device" or "in the cloud"), using the `inferenceSource` the SDK returns.

## Why each step runs where it does

| Step | Inference mode | Reason |
| --- | --- | --- |
| Describe a move-in photo | `PREFER_ON_DEVICE` | Works with no connection on move-in day; falls back to the cloud on phones and other browsers without a local model |
| Remove personal details | Browser-only pattern matching | The original letter has no cloud path. The renter reviews the cleaned copy before sending it. |
| Match charges to evidence | `ONLY_IN_CLOUD` | The cleaned letter and the saved condition record need the same cloud request |
| Deadline and statute | No model | Computed from the move-out date and quoted from the curated rules |

The photo model prefers on-device inference. The comparison uses the cloud because it needs the full record in one request. The redaction path is fixed in the browser, so no server-side setting can send the original letter to the cloud.

## Ground rules this keeps

- **The AI never decides what the law says.** The model describes photos and matches charges to evidence. Deadlines and statute text come only from the curated rules in `rules/`, which are still marked `draft-unverified`. The page says so, along with "not legal advice."
- **No demand letter.** The repo rule that letter templates pass legal-aid review before they ship still stands, so this entry stops at the evidence summary.
- **No paid AI service.** The Firebase project is on the free Spark plan with no billing account attached, so cloud use can't create a charge. Local inference costs nothing. See the 2026-11-26 entry in `JOURNAL.md`.
- **Nothing stored on our servers.** The record lives in the browser (IndexedDB). The cleaned deduction list and condition descriptions reach Google only when the tenant confirms a comparison. The page says that before the tenant confirms.

## Firebase pieces

- **AI Logic** (`firebase/ai`, Gemini Developer API backend) in hybrid mode. Requires JS SDK 12.5 or later for `inferenceSource`.
- **App Check**: reCAPTCHA Enterprise on the hosted page, a debug token in local development.

Project: `leaselookout-app`, web app "LeaseLookout Web". Config values come from `NEXT_PUBLIC_FIREBASE_*` variables (see `.env.example`).

## Out of scope

- Demand letters and small claims forms
- Accounts, sync, or saving the walkthrough to Supabase
- Android and iOS apps
- The lease clause check (it stays behind sign-in)

## Demo video (under 3 minutes)

1. The problem in one sentence, over an empty-apartment shot.
2. Chrome on a laptop with Wi-Fi off: record two rooms; each entry shows "on this device."
3. The same page on a phone: the photo step shows "in the cloud."
4. Paste a sample deduction letter, labeled as a sample on screen; contact details disappear on the device and the renter reviews the cleaned copy.
5. Back online: the charge-by-charge comparison, the deadline, and the quoted statute.
6. Close on what stays private and why.

## Schedule

| Day | Work |
| --- | --- |
| Thu Nov 26 | Firebase project, App Check, AI Logic wiring, photo description end to end |
| Fri Nov 27 | Offline record in IndexedDB, redaction step |
| Sat Nov 28 | Cloud comparison, deadline from rules, Remote Config, where-it-ran labels, hosted page |
| Sun Nov 29 | Tests and verification, demo video, Devpost text |
| Mon Nov 30 | Buffer; submit before 5:00 pm Eastern |

## Open items

- Confirm that the Vercel deployment can serve `/walkthrough` publicly while the rest of the app stays private.
- Create the reCAPTCHA Enterprise key for the hosted domain.
- Confirm that the on-device model is available in Chrome on the demo laptop.
- Sample deduction letter for the demo: it is invented, so it must be labeled as a sample everywhere it appears.
