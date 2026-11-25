/**
 * Server-only Plunk sender for app-originated transactional email.
 *
 * Plunk's send endpoint requires a secret key, so this module must only be
 * imported by route handlers or server actions.
 */

const DEFAULT_API_URL = 'https://next-api.useplunk.com';
const DEFAULT_FROM_ADDRESS = 'hello@leaselookout.com';
const DEFAULT_FROM_NAME = 'LeaseLookout';

const SITE_URL = 'https://www.leaselookout.com';
const PRIVACY_URL = `${SITE_URL}/privacy`;

export type SendEmailInput = {
  to: string;
  subject: string;
  text: string;
  html?: string;
  /** Where replies should land. */
  replyTo?: string;
  /** Override the verified sender address. */
  from?: string;
};

export type SendEmailResult = { ok: true; id: string } | { ok: false; error: string };

export interface PlunkErrorPayload {
  readonly code?: string;
  readonly message?: string;
}

export interface PlunkEmailEntry {
  readonly email?: string;
  readonly id?: string;
}

export interface PlunkDataPayload {
  readonly emails?: readonly PlunkEmailEntry[];
}

export interface PlunkResponsePayload {
  readonly success?: boolean;
  readonly data?: PlunkDataPayload;
  readonly error?: PlunkErrorPayload;
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function textToHtml(text: string) {
  return text
    .split(/\n{2,}/)
    .map((paragraph) => `<p>${escapeHtml(paragraph).replaceAll('\n', '<br />')}</p>`)
    .join('');
}

const HTML_FOOTER =
  `<hr style="margin:24px 0;border:none;border-top:1px solid #ddd0b4" />` +
  `<p style="font-family:ui-monospace,Menlo,Consolas,monospace;font-size:11px;letter-spacing:0.04em;text-transform:uppercase;color:#8a8472;line-height:1.6;margin:0 0 9px">This is not legal advice.</p>` +
  `<p style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:12px;color:#8a8472;line-height:1.6;margin:0">` +
  `<a href="${SITE_URL}" style="color:#2b4bf2">LeaseLookout</a> &middot; ` +
  `<a href="${PRIVACY_URL}" style="color:#2b4bf2">Privacy policy</a></p>`;

function requireConfig() {
  const key = process.env.PLUNK_SECRET_KEY?.trim();
  if (!key) {
    throw new Error('Plunk is not configured: set PLUNK_SECRET_KEY.');
  }

  return {
    key,
    apiUrl: (process.env.PLUNK_API_URL?.trim() || DEFAULT_API_URL).replace(/\/+$/, ''),
    fromAddress: process.env.PLUNK_FROM_ADDRESS?.trim() || DEFAULT_FROM_ADDRESS,
    fromName: process.env.PLUNK_FROM_NAME?.trim() || DEFAULT_FROM_NAME,
  };
}

function responseError(payload: PlunkResponsePayload | null | undefined, status: number): string {
  const error = payload?.error;
  const code = typeof error?.code === 'string' ? error.code : null;
  const message = typeof error?.message === 'string' ? error.message : null;
  const detail = message || code || `HTTP ${status}`;
  return `Plunk ${status}: ${detail}`;
}

function responseId(payload: PlunkResponsePayload | null | undefined): string {
  const emails = payload?.data?.emails;
  const first = Array.isArray(emails) ? emails[0] : undefined;
  return typeof first?.email === 'string' ? first.email : '';
}

export async function sendEmail(input: SendEmailInput): Promise<SendEmailResult> {
  const { key, apiUrl, fromAddress, fromName } = requireConfig();
  const body = `${input.html ?? textToHtml(input.text)}${HTML_FOOTER}`;

  const payload = {
    to: input.to,
    subject: input.subject,
    body,
    from: { name: fromName, email: input.from ?? fromAddress },
    ...(input.replyTo ? { reply: input.replyTo } : {}),
  };

  let response: Response;
  try {
    response = await fetch(`${apiUrl}/v1/send`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : 'network error' };
  }

  const responseBody = (await response.json().catch(() => null)) as PlunkResponsePayload | null;
  if (!response.ok || responseBody?.success !== true) {
    return { ok: false, error: responseError(responseBody, response.status) };
  }

  return { ok: true, id: responseId(responseBody) };
}
