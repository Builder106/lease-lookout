export type Redaction = { text: string; replacements: number };

const PATTERNS = [
  /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi,
  /(?<!\w)(?:\+?1[.\s-]?)?(?:\(?\d{3}\)?[.\s-]?)\d{3}[.\s-]?\d{4}(?!\w)/g,
  /\b(?:account|acct|account number|routing number)\s*(?:#|number|no\.?|:)?\s*[A-Z0-9-]{4,}\b/gi,
  /\b\d{1,6}\s+[A-Z][A-Za-z.'-]*(?:\s+[A-Z][A-Za-z.'-]*){0,4}\s+(?:Street|St\.?|Avenue|Ave\.?|Road|Rd\.?|Drive|Dr\.?|Lane|Ln\.?|Court|Ct\.?|Boulevard|Blvd\.?|Way|Place|Pl\.?)\b/gi,
];

/** Masks contact and account details in the browser before the letter can be sent. */
export function redactSensitiveText(input: string): Redaction {
  let replacements = 0;
  let text = input;
  for (const pattern of PATTERNS) {
    text = text.replace(pattern, () => {
      replacements += 1;
      return '[removed]';
    });
  }
  return { text, replacements };
}
