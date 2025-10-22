import { NextRequest } from 'next/server';
import { handleImageOptimization } from '@/lib/image-optimizer';
import { withRateLimit } from '@/lib/middleware/rate-limit';
import { withPerformanceMonitoring } from '@/lib/performance';

/**
 * Image optimization API endpoint
 * Usage: /api/optimize?url=IMAGE_URL&w=800&q=80&f=webp
 */
export const GET = withPerformanceMonitoring(
  withRateLimit(async (request: NextRequest) => {
    return await handleImageOptimization(request);
  }, { maxRequests: 50, windowMs: 60 * 1000 }) // 50 requests per minute
);
