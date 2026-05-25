// ─────────────────────────────────────────────────────────────────────────────
// Prova — Next.js Edge Middleware (Route Protection)
// Runs at the CDN edge before any route handler or page is executed.
// Auth enforcement here is defence-in-depth — API routes also enforce auth
// individually via withAuth() — but this prevents unauthorized requests
// from reaching the server at all.
// ─────────────────────────────────────────────────────────────────────────────

import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

// Routes that require any authenticated user
const PROTECTED_PREFIXES = ['/dashboard', '/admin'];

// Routes that require SUPER_ADMIN role
const ADMIN_PREFIXES = ['/admin'];

// Auth pages that should redirect away when already logged in
const AUTH_PAGES = ['/login', '/signup', '/join'];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Retrieve JWT from the secure httpOnly cookie — never from localStorage
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const isAuthenticated = Boolean(token);
  const isAdmin = token?.role === 'SUPER_ADMIN';

  // ── Redirect authenticated users away from auth pages ─────────────────────
  if (isAuthenticated && AUTH_PAGES.some((p) => pathname.startsWith(p))) {
    const role = token?.role as string | undefined;
    const destination =
      role === 'SUPER_ADMIN'
        ? '/admin'
        : role === 'PROFESSIONAL'
          ? '/dashboard/professional'
          : '/dashboard/client';
    return NextResponse.redirect(new URL(destination, req.url));
  }

  // ── Block unauthenticated access to protected routes ──────────────────────
  if (
    !isAuthenticated &&
    PROTECTED_PREFIXES.some((p) => pathname.startsWith(p))
  ) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ── Block non-admin access to admin routes ────────────────────────────────
  if (isAuthenticated && !isAdmin && ADMIN_PREFIXES.some((p) => pathname.startsWith(p))) {
    // Fail safe — deny access, redirect to their dashboard
    return NextResponse.redirect(new URL('/dashboard/client', req.url));
  }

  return NextResponse.next();
}

export const config = {
  // Apply middleware to all routes except static assets, images, and API
  // (API routes enforce auth themselves via withAuth())
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public|api).*)',
  ],
};
