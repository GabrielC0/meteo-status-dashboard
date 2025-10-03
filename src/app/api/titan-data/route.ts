import { NextResponse } from 'next/server';

import marketDataService from '@/lib/db/$marketData';
import ticketsService from '@/lib/db/$tickets';
import titanService from '@/lib/db/$titan';

export const dynamic = 'force-dynamic';

const GET = async () => {
  try {
    const [companies, sessions, ticketsStats] = await Promise.all([
      marketDataService.getAllCompaniesWithOperations(),
      titanService.getSessionMetrics(5),
      ticketsService.getTicketStats(),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        companies,
        sessions,
        ticketsStats,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('❌ API Error (/api/titan/dashboard):', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch TITAN dashboard data',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
};

export { GET };
