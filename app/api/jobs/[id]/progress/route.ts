// GET  /api/jobs/[id]/progress  — list progress updates
// POST /api/jobs/[id]/progress  — add a progress update (professional only)

import { NextRequest, NextResponse } from 'next/server';
import { withAuth, apiError } from '@/lib/auth/middleware';
import { prisma } from '@/lib/db/client';
import { PostProgressUpdateSchema } from '@/lib/validation/schemas';

function extractJobId(req: NextRequest): string {
  const parts = req.nextUrl.pathname.split('/');
  return parts[parts.indexOf('jobs') + 1];
}

export const GET = withAuth(async (req, { session }) => {
  const jobId = extractJobId(req);
  try {
    const job = await prisma.job.findUnique({
      where: { id: jobId, deletedAt: null },
      select: { clientId: true, professionalId: true },
    });
    if (!job) return apiError('Job not found', 'NOT_FOUND', 404);

    // Verify access
    const pro =
      session.role === 'PROFESSIONAL'
        ? await prisma.professional.findUnique({ where: { userId: session.id }, select: { id: true } })
        : null;

    const canAccess =
      session.role === 'SUPER_ADMIN' ||
      (session.role === 'CLIENT' && job.clientId === session.id) ||
      (session.role === 'PROFESSIONAL' && pro?.id === job.professionalId);

    if (!canAccess) return apiError('Forbidden', 'FORBIDDEN', 403);

    const updates = await prisma.progressUpdate.findMany({
      where: { jobId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        body: true,
        photoUrls: true,
        createdAt: true,
        professional: { select: { name: true, profilePhotoUrl: true } },
      },
    });

    return NextResponse.json({
      data: updates.map((u) => ({ ...u, createdAt: u.createdAt.toISOString() })),
    });
  } catch (err) {
    console.error('[GET /api/jobs/[id]/progress]', err);
    return apiError('Internal server error', 'INTERNAL_ERROR', 500);
  }
});

export const POST = withAuth(async (req, { session }) => {
  const jobId = extractJobId(req);
  try {
    if (session.role !== 'PROFESSIONAL') {
      return apiError('Only professionals can post progress updates', 'FORBIDDEN', 403);
    }

    const pro = await prisma.professional.findUnique({
      where: { userId: session.id },
      select: { id: true },
    });
    if (!pro) return apiError('Professional record not found', 'NOT_FOUND', 404);

    const job = await prisma.job.findUnique({
      where: { id: jobId, deletedAt: null },
      select: { clientId: true, professionalId: true, status: true },
    });
    if (!job || job.professionalId !== pro.id) {
      return apiError('Job not found', 'NOT_FOUND', 404);
    }
    if (job.status === 'COMPLETED' || job.status === 'CANCELLED') {
      return apiError('Cannot post updates on a closed job', 'BAD_REQUEST', 400);
    }

    const body = await req.json();
    const parsed = PostProgressUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return apiError('Validation failed', 'VALIDATION_ERROR', 422, parsed.error.flatten());
    }

    const update = await prisma.progressUpdate.create({
      data: {
        jobId,
        professionalId: pro.id,
        body: parsed.data.body,
        photoUrls: parsed.data.photoUrls,
      },
      select: {
        id: true,
        body: true,
        photoUrls: true,
        createdAt: true,
      },
    });

    // Notify the client
    await prisma.notification.create({
      data: {
        userId: job.clientId,
        type: 'PROGRESS_UPDATE_POSTED',
        title: 'Progress Update',
        body: `Your professional posted a new update on your job.`,
        metadata: { jobId, updateId: update.id },
      },
    });

    return NextResponse.json(
      { ...update, createdAt: update.createdAt.toISOString() },
      { status: 201 }
    );
  } catch (err) {
    console.error('[POST /api/jobs/[id]/progress]', err);
    return apiError('Internal server error', 'INTERNAL_ERROR', 500);
  }
}, 'PROFESSIONAL');
