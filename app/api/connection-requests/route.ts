// ─────────────────────────────────────────────────────────────────────────────
// POST /api/connection-requests
// Client submits a connection request for a matched professional.
// One connection per diagnostic session — enforced by unique constraint.
// ─────────────────────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/db/client';
import { apiError } from '@/lib/auth/middleware';
import { authOptions } from '@/lib/auth/session';
import { SubmitConnectionRequestSchema } from '@/lib/validation/schemas';
import type { SessionUser } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sessionId, ...rest } = body as { sessionId: string } & Record<string, unknown>;

    if (!sessionId) {
      return apiError('sessionId is required', 'VALIDATION_ERROR', 422);
    }

    const parsed = SubmitConnectionRequestSchema.safeParse(rest);
    if (!parsed.success) {
      return apiError('Validation failed', 'VALIDATION_ERROR', 422, parsed.error.flatten());
    }

    const { clientName, clientWhatsapp, clientCountry, professionalId } = parsed.data;

    // Verify the session exists
    const session = await prisma.diagnosticSession.findUnique({
      where: { id: sessionId },
      select: { id: true },
    });
    if (!session) {
      return apiError('Diagnostic session not found', 'NOT_FOUND', 404);
    }

    // Verify professional is APPROVED
    const professional = await prisma.professional.findUnique({
      where: { id: professionalId },
      select: { id: true, status: true },
    });
    if (!professional || professional.status !== 'APPROVED') {
      return apiError('Professional not available', 'NOT_FOUND', 404);
    }

    // Check for existing connection on this session
    const existing = await prisma.connectionRequest.findUnique({
      where: { sessionId },
      select: { id: true },
    });
    if (existing) {
      return apiError('Connection already submitted for this session', 'DUPLICATE', 409);
    }

    const nextAuthSession = await getServerSession(authOptions);
    const sessionUser = nextAuthSession?.user as SessionUser | undefined;
    const clientId = sessionUser?.role === 'CLIENT' ? sessionUser.id : undefined;

    const connectionRequest = await prisma.connectionRequest.create({
      data: {
        sessionId,
        clientId,
        clientName,
        clientWhatsapp,
        clientCountry,
        professionalId,
        status: 'PENDING',
      },
      select: {
        id: true,
        status: true,
        createdAt: true,
        professional: {
          select: { name: true, slug: true, whatsappNumber: true },
        },
      },
    });

    // Notify the professional of a new lead
    await prisma.notification.create({
      data: {
        userId: (await prisma.professional.findUnique({
          where: { id: professionalId },
          select: { userId: true },
        }))!.userId,
        type: 'NEW_LEAD_RECEIVED',
        title: 'New Lead',
        body: `${clientName} from ${clientCountry} wants to connect with you.`,
        metadata: { connectionRequestId: connectionRequest.id },
      },
    });

    return NextResponse.json({ connectionRequest }, { status: 201 });
  } catch (err) {
    console.error('[POST /api/connection-requests]', err);
    return apiError('Internal server error', 'INTERNAL_ERROR', 500);
  }
}
