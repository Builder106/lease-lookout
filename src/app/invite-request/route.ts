import { NextResponse, type NextRequest } from 'next/server';

import { sendEmail } from '@/lib/email/plunk';

// Sends email via the Node fetch path; force-dynamic since it must never be cached.
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Where access-request notifications land. Defaults to the founder's Workspace inbox.
const NOTIFY_TO = process.env.INVITE_NOTIFY_TO ?? 'founder@leaselookout.com';

// Conservative shape check — not full RFC 5322, just enough to reject garbage and
// cap length so the endpoint can't be coaxed into blasting arbitrary payloads.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Landing "Get an invite" capture. Notifies the founder of the request and sends
 * the requester a branded acknowledgment. Public (anonymous landing visitors);
 * the client redirects to /login regardless, so this is best-effort.
 */
export async function POST(request: NextRequest) {
  let body: { email?: string; company?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON.' }, { status: 400 });
  }

  // Honeypot: bots fill the hidden "company" field. Pretend success, send nothing.
  if (typeof body.company === 'string' && body.company.trim() !== '') {
    return NextResponse.json({ ok: true });
  }

  const email = typeof body.email === 'string' ? body.email.trim() : '';
  if (!email || email.length > 254 || !EMAIL_RE.test(email)) {
    return NextResponse.json({ ok: false, error: 'Enter a valid email.' }, { status: 400 });
  }

  // Notify the founder and acknowledge the requester. One failing must not sink the
  // other; replies on each are routed to a real inbox.
  const [notify, ack] = await Promise.allSettled([
    sendEmail({
      to: NOTIFY_TO,
      replyTo: email,
      subject: `New access request: ${email}`,
      text: `${email} requested a LeaseLookout beta invite.`,
    }),
    sendEmail({
      to: email,
      replyTo: NOTIFY_TO,
      subject: 'We got your LeaseLookout request',
      text:
        "Thanks for asking about LeaseLookout. We're in invite-only beta right now " +
        'and will reach out when a spot opens. Just reply if you have any questions.',
      html:
        "<p>Thanks for asking about LeaseLookout. We're in invite-only beta right now " +
        'and will reach out when a spot opens.</p>' +
        '<p>Just reply if you have any questions.</p>',
    }),
  ]);

  const trouble = [notify, ack].some(
    (r) => r.status === 'rejected' || (r.status === 'fulfilled' && !r.value.ok)
  );
  if (trouble) {
    // Surfaces in Vercel runtime logs; UX still proceeds. Wire alerting before scale.
    console.error('invite-request send issue', JSON.stringify({ notify, ack }));
  }

  return NextResponse.json({ ok: true });
}
