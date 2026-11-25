import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

/**
 * Refreshes the Supabase session on each request and redirects unauthenticated
 * users to /login. Called from the root proxy.ts (Next 16's renamed middleware).
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  // Always create a new client per request (don't hoist to a global with Fluid compute).
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
          // Cache headers from @supabase/ssr keep CDNs from leaking sessions.
          if (headers) {
            Object.entries(headers).forEach(([key, value]) =>
              supabaseResponse.headers.set(key, value as string)
            );
          }
        },
      },
    }
  );

  // Do NOT run code between createServerClient and getClaims(), and use getClaims()
  // (not getSession) — it validates the JWT signature, which is safe in the proxy.
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  // "/" serves a public landing when logged out; only gate the authenticated areas.
  const isProtected = request.nextUrl.pathname.startsWith('/history');
  if (!user && isProtected) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
