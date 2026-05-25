// ─────────────────────────────────────────────────────────────────────────────
// GET  /api/jobs/[id]   — job detail
// PATCH /api/jobs/[id]  — update job status (confirm completion)
// ─────────────────────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from 'next/server';
import { withAuth, apiError } from '@/lib/auth/middleware';
import { prisma } from '@/lib/db/client';
import type { SessionUser } from '@/types';

async function getJob(jobId: string, session: SessionUser) {
  const job = await prisma.job.findUnique({
    where: { id: jobId, deletedAt: null },
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
      clientId: true,
      professionalId: true,
      clientConfirmedComplete: true,
      professionalConfirmedComplete: true,
      createdAt: true,
      updatedAt: true,
      professional: {
        select: { id: true, name: true, slug: true, profilePhotoUrl: true },
      },
      progressUpdates: {
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          body: true,
          photoUrls: true,
          createdAt: true,
          professional: { select: { name: true, profilePhotoUrl: true } },
        },
      },
      review: {
        select: { id: true, rating: true, body: true, createdAt: true },
      },
    },
  });
  if (!job) return null;

  // Check ownership: clients can only see their own jobs, pros their own
  if (session.role === 'CLIENT' && job.clientId !== session.id) return null;
  if (session.role === 'PROFESSIONAL') {
    const pro = await prisma.professional.findUnique({
      where: { userId: session.id },
      select: { id: true },
    });
    if (pro?.id !== job.professionalId) return null;
  }
  return job;
}

export const GET = withAuth(async (req, { session }) => {
  const jobId = req.nextUrl.pathname.split('/').at(-1)!;
  try {
    const job = await getJob(jobId, session);
    if (!job) return apiError('Job not found', 'NOT_FOUND', 404);

    return NextResponse.json({
      ...job,
      startedAt: job.startedAt?.toISOString() ?? null,
      completedAt: job.completedAt?.toISOString() ?? null,
      createdAt: job.createdAt.toISOString(),
      updatedAt: job.updatedAt.toISOString(),
      progressUpdates: job.progressUpdates.map((u) => ({
        ...u,
        createdAt: u.createdAt.toISOString(),
      })),
      review: job.review
        ? { ...job.review, createdAt: job.review.createdAt.toISOString() }
        : null,
    });
  } catch (err) {
    console.error('[GET /api/jobs/[id]]', err);
    return apiError('Internal server error', 'INTERNAL_ERROR', 500);
  }
});

export const PATCH = withAuth(async (req, { session }) => {
  const jobId = req.nextUrl.pathname.split('/').at(-1)!;
  try {
    const job = await getJob(jobId, session);
    if (!job) return apiError('Job not found', 'NOT_FOUND', 404);

    const body = await req.json();
    const { action } = body as { action: string };

    if (action === 'confirm_complete') {
      const isClient = session.role === 'CLIENT';
      const isPro = session.role === 'PROFESSIONAL';

      const updated = await prisma.job.update({
        where: { id: jobId },
        data: {
          ...(isClient ? { clientConfirmedComplete: true } : {}),
          ...(isPro ? { professionalConfirmedComplete: true } : {}),
        },
        select: {
          clientConfirmedComplete: true,
          professionalConfirmedComplete: true,
        },
      });

      // If both parties confirmed — mark completed
      if (updated.clientConfirmedComplete && updated.professionalConfirmedComplete) {
        await prisma.job.update({
          where: { id: jobId },
          data: { status: 'COMPLETED', completedAt: new Date() },
        });
      }

      return NextResponse.json({ success: true });
    }

    return apiError('Unknown action', 'BAD_REQUEST', 400);
  } catch (err) {
    console.error('[PATCH /api/jobs/[id]]', err);
    return apiError('Internal server error', 'INTERNAL_ERROR', 500);
  }
});
