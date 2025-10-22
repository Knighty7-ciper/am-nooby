interface RateLimitStore {
  [key: string]: {
    count: number;
    resetAt: number;
  };
}

export class RateLimiter {
  private store: RateLimitStore = {};
  public maxRequests: number;
  private windowMs: number;
  
  constructor(options: { maxRequests: number; windowMs: number }) {
    this.maxRequests = options.maxRequests;
    this.windowMs = options.windowMs;
    
    // Clean up old entries every minute
    setInterval(() => this.cleanup(), 60 * 1000);
  }
  
  async check(identifier: string): Promise<{
    success: boolean;
    remaining: number;
    reset: number;
  }> {
    const now = Date.now();
    const record = this.store[identifier];
    
    // No record or expired
    if (!record || now > record.resetAt) {
      const resetAt = now + this.windowMs;
      this.store[identifier] = {
        count: 1,
        resetAt,
      };
      return {
        success: true,
        remaining: this.maxRequests - 1,
        reset: resetAt,
      };
    }
    
    // Increment count
    record.count++;
    
    // Check if exceeded
    if (record.count > this.maxRequests) {
      return {
        success: false,
        remaining: 0,
        reset: record.resetAt,
      };
    }
    
    return {
      success: true,
      remaining: this.maxRequests - record.count,
      reset: record.resetAt,
    };
  }
  
  private cleanup() {
    const now = Date.now();
    Object.keys(this.store).forEach((key) => {
      if (now > this.store[key].resetAt) {
        delete this.store[key];
      }
    });
  }
}
