import { NextRequest, NextResponse } from 'next/server';
import { performanceMonitor, getPerformanceStats } from '@/lib/performance';
import { cache } from '@/lib/cache';

/**
 * Performance monitoring dashboard API
 */
export async function GET(request: NextRequest) {
  try {
    const stats = getPerformanceStats();
    
    return NextResponse.json({
      ...stats,
      cacheStats: {
        // In production, get these from Redis
        size: 0,
        hits: 0,
        misses: 0,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to get performance stats' }, { status: 500 });
  }
}
