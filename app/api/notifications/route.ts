// ─────────────────────────────────────────────────────────────────────────────
// GET   /api/notifications  — list unread notifications for current user
// PATCH /api/notifications  — mark notification(s) as read
// ─────────────────────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from 'next/server';
import { withAuth, apiError } from '@/lib/auth/middleware';
import { prisma } from '@/lib/db/client';

export const GET = withAuth(async (_req, { session }) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: session.id },
      orderBy: { createdAt: 'desc' },
      take: 50,
      select: {
        id: true,
        type: true,
        title: true,
        body: true,
        metadata: true,
        isRead: true,
        readAt: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      data: notifications.map((n) => ({
        ...n,
        metadata: n.metadata as Record<string, unknown>,
        readAt: n.readAt?.toISOString() ?? null,
        createdAt: n.createdAt.toISOString(),
      })),
      unreadCount: notifications.filter((n) => !n.isRead).length,
    });
  } catch (err) {
    console.error('[GET /api/notifications]', err);
    return apiError('Internal server error', 'INTERNAL_ERROR', 500);
  }
});

export const PATCH = withAuth(async (req, { session }) => {
  try {
    const body = await req.json();
    const ids = body.ids as string[] | undefined;

    if (ids && ids.length > 0) {
      // Mark specific notifications as read
      await prisma.notification.updateMany({
        where: { id: { in: ids }, userId: session.id },
        data: { isRead: true, readAt: new Date() },
      });
    } else {
      // Mark all as read
      await prisma.notification.updateMany({
        where: { userId: session.id, isRead: false },
        data: { isRead: true, readAt: new Date() },
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[PATCH /api/notifications]', err);
    return apiError('Internal server error', 'INTERNAL_ERROR', 500);
  }
});
