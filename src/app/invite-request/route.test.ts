import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { POST } from './route';
import * as plunk from '@/lib/email/plunk';

vi.mock('@/lib/email/plunk', () => ({
  sendEmail: vi.fn(),
}));

function createNextRequest(body: unknown, failJson = false): NextRequest {
  if (failJson) {
    return new NextRequest('http://localhost:3000/invite-request', {
      method: 'POST',
      body: 'invalid-json',
    });
  }
  return new NextRequest('http://localhost:3000/invite-request', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('POST /invite-request', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns 400 when request body is invalid JSON', async () => {
    const res = await POST(createNextRequest(null, true));
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data).toEqual({ ok: false, error: 'Invalid JSON.' });
  });

  it('silently ignores bots when honeypot company field is filled', async () => {
    const res = await POST(createNextRequest({ email: 'spammer@bot.com', company: 'Bot Corp' }));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toEqual({ ok: true });
    expect(plunk.sendEmail).not.toHaveBeenCalled();
  });

  it('returns 400 when email is missing, empty, or not a string', async () => {
    const res1 = await POST(createNextRequest({ email: '   ' }));
    expect(res1.status).toBe(400);
    const data1 = await res1.json();
    expect(data1).toEqual({ ok: false, error: 'Enter a valid email.' });

    const res2 = await POST(createNextRequest({ email: 12345 }));
    expect(res2.status).toBe(400);
    const data2 = await res2.json();
    expect(data2).toEqual({ ok: false, error: 'Enter a valid email.' });
  });

  it('returns 400 when email is invalid format or exceeds 254 chars', async () => {
    const longEmail = 'a'.repeat(250) + '@example.com';
    const res1 = await POST(createNextRequest({ email: longEmail }));
    expect(res1.status).toBe(400);

    const res2 = await POST(createNextRequest({ email: 'notanemail' }));
    expect(res2.status).toBe(400);
  });

  it('sends emails and returns 200 on valid email submission', async () => {
    vi.mocked(plunk.sendEmail).mockResolvedValue({ ok: true, id: 'msg-123' });

    const res = await POST(createNextRequest({ email: 'student@wesleyan.edu' }));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toEqual({ ok: true });

    expect(plunk.sendEmail).toHaveBeenCalledTimes(2);
    // Notification to founder
    expect(plunk.sendEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: expect.any(String),
        replyTo: 'student@wesleyan.edu',
        subject: 'New access request: student@wesleyan.edu',
      })
    );
    // Ack to requester
    expect(plunk.sendEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'student@wesleyan.edu',
        subject: 'We got your LeaseLookout request',
        html: expect.stringContaining('Thanks for asking'),
      })
    );
  });

  it('handles email sending failure gracefully without failing the request', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.mocked(plunk.sendEmail)
      .mockResolvedValueOnce({ ok: false, error: 'Plunk error' })
      .mockRejectedValueOnce(new Error('Network error'));

    const res = await POST(createNextRequest({ email: 'user@example.com' }));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toEqual({ ok: true });

    expect(errorSpy).toHaveBeenCalled();
  });
});
