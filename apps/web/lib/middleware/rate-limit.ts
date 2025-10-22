import { NextRequest, NextResponse } from 'next/server';
import { RateLimiter } from '@/lib/rate-limiter';

const limiter = new RateLimiter({
  maxRequests: 100, // Max requests per window
  windowMs: 60 * 1000, // 1 minute
});

export async function rateLimit(
  request: NextRequest,
  options?: { maxRequests?: number; windowMs?: number }
) {
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
  
  const customLimiter = options
    ? new RateLimiter({
        maxRequests: options.maxRequests ?? 100,
        windowMs: options.windowMs ?? 60 * 1000,
      })
    : limiter;
  
  const { success, remaining, reset } = await customLimiter.check(ip);
  
  if (!success) {
    return NextResponse.json(
      {
        error: 'Too many requests',
        message: `Rate limit exceeded. Try again in ${Math.ceil((reset - Date.now()) / 1000)} seconds.`,
      },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': String(customLimiter.maxRequests),
          'X-RateLimit-Remaining': String(remaining),
          'X-RateLimit-Reset': String(reset),
        },
      }
    );
  }
  
  return null; // Continue processing
}

/**
 * Rate limit middleware decorator
 */
export function withRateLimit(
  handler: (req: NextRequest, ...args: any[]) => Promise<Response>,
  options?: { maxRequests?: number; windowMs?: number }
) {
  return async (req: NextRequest, ...args: any[]) => {
    const rateLimitResponse = await rateLimit(req, options);
    if (rateLimitResponse) return rateLimitResponse;
    
    return handler(req, ...args);
  };
}
