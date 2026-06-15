/**
 * Lightweight in-memory rate limiter for serverless environments.
 * Note: In Vercel/Next.js edge or serverless environments, this state resets on cold starts.
 * It is effective against bursts but should be replaced by Redis (e.g. Upstash) for strict limits.
 */

type RateLimitEntry = {
  count: number;
  resetTime: number;
};

const store = new Map<string, RateLimitEntry>();

// Clean up expired entries every 10 minutes to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of store.entries()) {
    if (now > entry.resetTime) {
      store.delete(ip);
    }
  }
}, 10 * 60 * 1000);

export function checkRateLimit(ip: string, limit: number, windowMs: number): { success: boolean; limit: number; remaining: number; reset: number } {
  const now = Date.now();
  const entry = store.get(ip);

  if (!entry || now > entry.resetTime) {
    store.set(ip, {
      count: 1,
      resetTime: now + windowMs
    });
    return { success: true, limit, remaining: limit - 1, reset: now + windowMs };
  }

  if (entry.count >= limit) {
    return { success: false, limit, remaining: 0, reset: entry.resetTime };
  }

  entry.count += 1;
  store.set(ip, entry);

  return { success: true, limit, remaining: limit - entry.count, reset: entry.resetTime };
}
