import { NextResponse } from 'next/server';

interface CacheConfig {
  ttl?: number; // Time to live in seconds
  staleWhileRevalidate?: number; // Stale-while-revalidate in seconds
  tags?: string[]; // Cache tags for invalidation
}

/**
 * In-memory cache store (use Redis in production)
 */
class CacheStore {
  private store = new Map<string, { data: any; expiresAt: number }>();
  
  set(key: string, data: any, ttl: number) {
    this.store.set(key, {
      data,
      expiresAt: Date.now() + ttl * 1000,
    });
  }
  
  get(key: string): any | null {
    const entry = this.store.get(key);
    if (!entry) return null;
    
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }
    
    return entry.data;
  }
  
  delete(key: string) {
    this.store.delete(key);
  }
  
  clear() {
    this.store.clear();
  }
  
  has(key: string): boolean {
    return this.get(key) !== null;
  }
}

export const cache = new CacheStore();

/**
 * Cache wrapper for API responses
 */
export async function withCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  config: CacheConfig = {}
): Promise<T> {
  const { ttl = 300 } = config; // Default 5 minutes
  
  // Check cache
  const cached = cache.get(key);
  if (cached) {
    return cached;
  }
  
  // Fetch fresh data
  const data = await fetcher();
  
  // Store in cache
  cache.set(key, data, ttl);
  
  return data;
}

/**
 * Cache invalidation
 */
export function invalidateCache(pattern?: string) {
  if (!pattern) {
    cache.clear();
    return;
  }
  
  // TODO: Implement pattern-based invalidation
  cache.clear();
}

/**
 * HTTP cache headers helper
 */
export function setCacheHeaders(
  response: NextResponse,
  config: CacheConfig = {}
): NextResponse {
  const { ttl = 300, staleWhileRevalidate = 60, tags = [] } = config;
  
  // Set Cache-Control header
  response.headers.set(
    'Cache-Control',
    `public, s-maxage=${ttl}, stale-while-revalidate=${staleWhileRevalidate}`
  );
  
  // Set cache tags for Vercel
  if (tags.length > 0) {
    response.headers.set('Cache-Tag', tags.join(','));
  }
  
  return response;
}

/**
 * Revalidation helper
 */
export async function revalidatePath(path: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/revalidate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path }),
    });
    return response.ok;
  } catch (error) {
    console.error('Revalidation failed:', error);
    return false;
  }
}
