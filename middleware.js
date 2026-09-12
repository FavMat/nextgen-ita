/**
 * Ciao Mirta — Vercel Edge Middleware
 * Server-side gate for protected routes. Reads the Supabase auth cookie.
 *
 * Protected paths: /agentry/*, /toolbox/protected/*, etc. (see PROTECTED list)
 * If a path matches and there's no auth cookie → redirect to /login?return_to=<path>
 *
 * NOTE: This is a coarse server-side check (cookie present + non-empty).
 * Fine-grained per-feature gating still happens client-side via assets/auth.js.
 */

const PROJECT_REF = 'vpqnyogmsipugvdhgaxj';
const COOKIE_NAME = `sb-${PROJECT_REF}-auth-token`;

// Deliberately empty: the gate is dormant, not deleted.
//
// The three paths that used to be here (/agentry, /toolbox/protected,
// /cgt-radar/deep) never existed, so the only thing the gate achieved was
// sending visitors to a signup form to reach a 404. /agentry was a fossil in
// particular: Agentry moved to agents.ciaomirta.it, which is open and says so.
//
// Everything behind this still works, Supabase, the login and account pages,
// consent logging, RLS. To gate real paid or member areas later, put their
// patterns back in this array and the server side check resumes.
const PROTECTED = [];

const PUBLIC_AUTH_PATHS = ['/login.html', '/login', '/auth/callback.html', '/auth/callback'];

export const config = {
  matcher: [
    '/((?!_next|api|assets|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff2|map)$).*)'
  ]
};

function hasAuthCookie(req) {
  const cookieHeader = req.headers.get('cookie') || '';
  // Supabase may chunk the token across cookies: sb-<ref>-auth-token, sb-<ref>-auth-token.0, .1, ...
  const re = new RegExp('(?:^|;\\s*)' + COOKIE_NAME.replace(/-/g, '\\-') + '(?:\\.\\d+)?=([^;]+)');
  const m = cookieHeader.match(re);
  return !!(m && m[1] && m[1].length > 20);
}

export default function middleware(req) {
  const url = new URL(req.url);
  const path = url.pathname;

  // Don't gate auth pages themselves
  if (PUBLIC_AUTH_PATHS.includes(path)) return;

  // Only gate protected matches
  const isProtected = PROTECTED.some(rx => rx.test(path));
  if (!isProtected) return;

  if (hasAuthCookie(req)) return; // pass through

  const loginUrl = new URL('/login.html', req.url);
  loginUrl.searchParams.set('return_to', path + url.search);
  return Response.redirect(loginUrl, 307);
}
