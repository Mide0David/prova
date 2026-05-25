// ─────────────────────────────────────────────────────────────────────────────
// POST /api/diagnostic
// Creates a DiagnosticSession and immediately runs the matching algorithm.
// Returns the top-3 matched professionals and the sessionId for follow-up.
// ─────────────────────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/db/client';
import { apiError } from '@/lib/auth/middleware';
import { authOptions } from '@/lib/auth/session';
import { CreateDiagnosticSessionSchema } from '@/lib/validation/schemas';
import { runMatching } from '@/lib/services/matching';
import type { SessionUser, BudgetRange, ServiceCategory } from '@/types';

// Map schema budget enum → internal enum (schema uses different naming)
const BUDGET_MAP: Record<string, BudgetRange> = {
  UNDER_100K: 'UNDER_100K',
  ONE_HUNDRED_K_500K: '100K_500K',
  FIVE_HUNDRED_K_2M: '500K_2M',
  ABOVE_2M: 'ABOVE_2M',
};

// Map ProjectType → relevant ServiceCategories for matching
const PROJECT_CATEGORY_MAP: Record<string, ServiceCategory[]> = {
  HOME_RENOVATION:   ['RENOVATION_CONTRACTOR', 'INTERIOR_DESIGN', 'PLUMBING', 'ELECTRICAL'],
  INTERIOR_DESIGN:   ['INTERIOR_DESIGN'],
  HOME_REPAIRS:      ['PLUMBING', 'ELECTRICAL', 'RENOVATION_CONTRACTOR'],
  NEW_CONSTRUCTION:  ['ARCHITECTURE', 'RENOVATION_CONTRACTOR'],
  SMART_HOME:        ['SMART_HOME', 'ELECTRICAL'],
  LANDSCAPING:       ['LANDSCAPING'],
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = CreateDiagnosticSessionSchema.safeParse(body);
    if (!parsed.success) {
      return apiError('Validation failed', 'VALIDATION_ERROR', 422, parsed.error.flatten());
    }

    const { projectType, projectStage, budgetRange, location } = parsed.data;

    // Optionally attach to a logged-in client
    const nextAuthSession = await getServerSession(authOptions);
    const sessionUser = nextAuthSession?.user as SessionUser | undefined;
    const clientId = sessionUser?.role === 'CLIENT' ? sessionUser.id : undefined;

    // Create the diagnostic session
    const session = await prisma.diagnosticSession.create({
      data: {
        clientId,
        projectType,
        projectStage,
        budgetRange,
        location,
        ipAddress: req.headers.get('x-forwarded-for') ?? req.headers.get('x-real-ip') ?? undefined,
        userAgent: req.headers.get('user-agent') ?? undefined,
        completedAt: new Date(),
      },
      select: { id: true },
    });

    // Map budget and categories for matching service
    const mappedBudget = BUDGET_MAP[budgetRange] ?? 'UNDER_100K';
    const categories = PROJECT_CATEGORY_MAP[projectType] ?? [];

    const matches = await runMatching(session.id, {
      categories,
      location,
      budgetRange: mappedBudget,
    });

    return NextResponse.json({
      sessionId: session.id,
      matches,
    });
  } catch (err) {
    console.error('[POST /api/diagnostic]', err);
    return apiError('Internal server error', 'INTERNAL_ERROR', 500);
  }
}
