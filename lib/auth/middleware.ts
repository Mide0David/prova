// ─────────────────────────────────────────────────────────────────────────────
// Prova — Auth Middleware & Route Protection HOF
// withAuth wraps an API route handler with authentication + role checking.
// Authorization is enforced server-side on every request — never client-side.
// ─────────────────────────────────────────────────────────────────────────────

import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from './session';
import type { UserRole, SessionUser } from '@/types';

// ── Error Response Helper ─────────────────────────────────────────────────────

export function apiError(
  message: string,
  code: string,
  status: number,
  details?: unknown
): NextResponse {
  return NextResponse.json(
    { error: message, code, ...(details ? { details } : {}) },
    { status }
  );
}

// ── Auth Context injected into wrapped handlers ───────────────────────────────

export interface AuthContext {
  session: SessionUser;
}

type AuthenticatedHandler<T = unknown> = (
  req: NextRequest,
  ctx: AuthContext & T,
  params?: Record<string, string>
) => Promise<NextResponse>;

// ── withAuth HOF ──────────────────────────────────────────────────────────────

/**
 * Wraps an API route handler with authentication and optional role enforcement.
 * If the user is not authenticated → 401.
 * If the user does not have the required role → 403.
 * Fail-safe: denied by default on any error.
 */
export function withAuth<T = unknown>(
  handler: AuthenticatedHandler<T>,
  requiredRole?: UserRole | UserRole[]
) {
  return async (
    req: NextRequest,
    { params }: { params?: Record<string, string> } = {}
  ): Promise<NextResponse> => {
    try {
      const nextAuthSession = await getServerSession(authOptions);

      if (!nextAuthSession?.user) {
        return apiError('Authentication required', 'UNAUTHENTICATED', 401);
      }

      const sessionUser = nextAuthSession.user as SessionUser;

      // Role check — supports single role or array of allowed roles
      if (requiredRole) {
        const allowed = Array.isArray(requiredRole)
          ? requiredRole
          : [requiredRole];
        if (!allowed.includes(sessionUser.role)) {
          return apiError('Insufficient permissions', 'FORBIDDEN', 403);
        }
      }

      return handler(req, { session: sessionUser } as AuthContext & T, params);
    } catch (err) {
      // Fail safe — deny access on any unexpected error
      console.error('[Auth Middleware Error]', err instanceof Error ? err.message : 'Unknown');
      return apiError('Internal server error', 'INTERNAL_ERROR', 500);
    }
  };
}

// ── getRequiredSession (for Server Components) ────────────────────────────────

/**
 * Use in Server Components and Server Actions to get the current session.
 * Returns null if not authenticated — never throws.
 */
export async function getRequiredSession(): Promise<SessionUser | null> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return null;
    return session.user as SessionUser;
  } catch {
    return null;
  }
}

// ── Validate resource ownership ───────────────────────────────────────────────

/**
 * Throws a 403 if the requesting user does not own the resource.
 * Admins bypass ownership checks.
 */
export function assertOwnership(
  sessionUserId: string,
  resourceOwnerId: string,
  role: UserRole
): void | never {
  if (role === 'SUPER_ADMIN') return; // admins can access everything
  if (sessionUserId !== resourceOwnerId) {
    throw new OwnershipError();
  }
}

export class OwnershipError extends Error {
  constructor() {
    super('Resource ownership check failed');
    this.name = 'OwnershipError';
  }
}
