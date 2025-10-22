import { NextRequest, NextResponse } from 'next/server';

interface PerformanceMetrics {
  requestId: string;
  method: string;
  path: string;
  duration: number;
  statusCode: number;
  timestamp: Date;
  userAgent?: string;
  ip?: string;
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics[] = [];
  private maxMetrics = 1000; // Keep last 1000 requests
  
  log(metric: PerformanceMetrics) {
    this.metrics.push(metric);
    
    // Keep only recent metrics
    if (this.metrics.length > this.maxMetrics) {
      this.metrics.shift();
    }
    
    // Log slow requests
    if (metric.duration > 1000) {
      console.warn(`Slow request detected: ${metric.method} ${metric.path} took ${metric.duration}ms`);
    }
  }
  
  getMetrics(limit = 100) {
    return this.metrics.slice(-limit);
  }
  
  getAverageDuration(path?: string) {
    const filteredMetrics = path
      ? this.metrics.filter((m) => m.path === path)
      : this.metrics;
    
    if (filteredMetrics.length === 0) return 0;
    
    const total = filteredMetrics.reduce((sum, m) => sum + m.duration, 0);
    return total / filteredMetrics.length;
  }
  
  getSlowRequests(threshold = 1000) {
    return this.metrics.filter((m) => m.duration > threshold);
  }
}

export const performanceMonitor = new PerformanceMonitor();

/**
 * Performance monitoring middleware
 */
export function withPerformanceMonitoring(
  handler: (req: NextRequest, ...args: any[]) => Promise<Response>
) {
  return async (req: NextRequest, ...args: any[]) => {
    const startTime = Date.now();
    const requestId = crypto.randomUUID();
    
    try {
      const response = await handler(req, ...args);
      const duration = Date.now() - startTime;
      
      // Log metrics
      performanceMonitor.log({
        requestId,
        method: req.method,
        path: req.nextUrl.pathname,
        duration,
        statusCode: response.status,
        timestamp: new Date(),
        userAgent: req.headers.get('user-agent') || undefined,
        ip: req.ip || req.headers.get('x-forwarded-for') || undefined,
      });
      
      // Add performance headers
      response.headers.set('X-Request-ID', requestId);
      response.headers.set('X-Response-Time', `${duration}ms`);
      
      return response;
    } catch (error) {
      const duration = Date.now() - startTime;
      
      performanceMonitor.log({
        requestId,
        method: req.method,
        path: req.nextUrl.pathname,
        duration,
        statusCode: 500,
        timestamp: new Date(),
      });
      
      throw error;
    }
  };
}

/**
 * Get performance stats
 */
export function getPerformanceStats() {
  const metrics = performanceMonitor.getMetrics();
  const slowRequests = performanceMonitor.getSlowRequests();
  
  return {
    totalRequests: metrics.length,
    averageDuration: performanceMonitor.getAverageDuration(),
    slowRequests: slowRequests.length,
    recentMetrics: metrics.slice(-10),
  };
}
