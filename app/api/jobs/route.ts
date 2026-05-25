// ─────────────────────────────────────────────────────────────────────────────
// GET /api/jobs         — list jobs for the current user
// ─────────────────────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from 'next/server';
import { withAuth, apiError } from '@/lib/auth/middleware';
import { prisma } from '@/lib/db/client';

export const GET = withAuth(async (_req, { session }) => {
  try {
    const isClient = session.role === 'CLIENT';
    const isProfessional = session.role === 'PROFESSIONAL';

    let professionalId: string | undefined;
    if (isProfessional) {
      const pro = await prisma.professional.findUnique({
        where: { userId: session.id },
        select: { id: true },
      });
      professionalId = pro?.id;
    }

    const jobs = await prisma.job.findMany({
      where: {
        deletedAt: null,
        ...(isClient ? { clientId: session.id } : {}),
        ...(isProfessional && professionalId ? { professionalId } : {}),
      },
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        title: true,
        description: true,
        location: true,
        category: true,
        budgetNaira: true,
        status: true,
        startedAt: true,
        completedAt: true,
        clientConfirmedComplete: true,
        professionalConfirmedComplete: true,
        createdAt: true,
        updatedAt: true,
        professional: {
          select: {
            id: true,
            name: true,
            slug: true,
            profilePhotoUrl: true,
          },
        },
      },
    });

    return NextResponse.json({
      data: jobs.map((j) => ({
        ...j,
        startedAt: j.startedAt?.toISOString() ?? null,
        completedAt: j.completedAt?.toISOString() ?? null,
        createdAt: j.createdAt.toISOString(),
        updatedAt: j.updatedAt.toISOString(),
      })),
    });
  } catch (err) {
    console.error('[GET /api/jobs]', err);
    return apiError('Internal server error', 'INTERNAL_ERROR', 500);
  }
});
