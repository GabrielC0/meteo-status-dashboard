import { NextResponse } from 'next/server';

import { getPoolStats, testConnection } from '@/lib/db/config';

export const dynamic = 'force-dynamic';

export async function GET() {
  const startTime = Date.now();

  try {
    await testConnection();
    const poolStats = getPoolStats();
    const responseTime = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      status: 'healthy',
      timestamp: new Date().toISOString(),
      responseTimeMs: responseTime,
      database: {
        connected: true,
        pool: poolStats,
      },
      version: process.env.npm_package_version || '1.0.0',
    });
  } catch (error) {
    const responseTime = Date.now() - startTime;

    console.error('❌ Health Check Failed:', error);

    return NextResponse.json(
      {
        success: false,
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        responseTimeMs: responseTime,
        database: {
          connected: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        },
        version: process.env.npm_package_version || '1.0.0',
      },
      { status: 503 },
    );
  }
}
