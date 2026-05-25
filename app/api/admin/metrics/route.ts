// GET /api/admin/metrics — platform-wide metrics (SUPER_ADMIN only)

import { NextResponse } from 'next/server';
import { withAuth, apiError } from '@/lib/auth/middleware';
import { prisma } from '@/lib/db/client';

export const GET = withAuth(async (_req, _ctx) => {
  try {
    const [
      proTotal, proByStatus,
      connTotal, connByStatus,
      jobTotal, jobByStatus,
      totalRevenue,
    ] = await Promise.all([
      prisma.professional.count({ where: { deletedAt: null } }),
      prisma.professional.groupBy({ by: ['status'], _count: { id: true }, where: { deletedAt: null } }),
      prisma.connectionRequest.count({ where: { deletedAt: null } }),
      prisma.connectionRequest.groupBy({ by: ['status'], _count: { id: true }, where: { deletedAt: null } }),
      prisma.job.count({ where: { deletedAt: null } }),
      prisma.job.groupBy({ by: ['status'], _count: { id: true }, where: { deletedAt: null } }),
      prisma.introFee.aggregate({
        _sum: { amountNaira: true },
        where: { paymentStatus: 'PAID' },
      }),
    ]);

    const completedJobs = jobByStatus.find((r) => r.status === 'COMPLETED')?._count.id ?? 0;
    const conversionRate = connTotal > 0 ? Math.round((completedJobs / connTotal) * 100) : 0;

    return NextResponse.json({
      professionals: {
        total: proTotal,
        byStatus: Object.fromEntries(proByStatus.map((r) => [r.status, r._count.id])),
      },
      connectionRequests: {
        total: connTotal,
        byStatus: Object.fromEntries(connByStatus.map((r) => [r.status, r._count.id])),
      },
      jobs: {
        total: jobTotal,
        byStatus: Object.fromEntries(jobByStatus.map((r) => [r.status, r._count.id])),
      },
      conversionRate,
      totalRevenue: totalRevenue._sum.amountNaira ?? 0,
    });
  } catch (err) {
    console.error('[GET /api/admin/metrics]', err);
    return apiError('Internal server error', 'INTERNAL_ERROR', 500);
  }
}, 'SUPER_ADMIN');
