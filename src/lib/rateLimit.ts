/**
 * src/lib/rateLimit.ts
 *
 * Simple in-memory sliding-window rate limiter.
 * Keyed by client IP; resets on serverless cold start.
 * For higher-traffic needs, swap the store for Upstash / Redis.
 */

interface WindowState {
  count: number;
  windowStart: number;
}

const store = new Map<string, WindowState>();

/** Prune stale entries so the store doesn't grow forever. */
let lastClean = Date.now();
function maybePrune(windowMs: number): void {
  const now = Date.now();
  if (now - lastClean < windowMs * 10) return;
  lastClean = now;
  for (const [key, state] of store) {
    if (now - state.windowStart > windowMs) store.delete(key);
  }
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetMs: number;
}

/**
 * Check whether `ip` is within the allowed rate.
 *
 * @param ip       Client IP string
 * @param limit    Max requests per window (default 30)
 * @param windowMs Window length in ms (default 60 000 = 1 minute)
 */
export function rateLimit(
  ip: string,
  {
    limit = 30,
    windowMs = 60_000,
  }: { limit?: number; windowMs?: number } = {}
): RateLimitResult {
  maybePrune(windowMs);
  const now = Date.now();
  const state = store.get(ip);

  if (!state || now - state.windowStart > windowMs) {
    store.set(ip, { count: 1, windowStart: now });
    return { allowed: true, remaining: limit - 1, resetMs: now + windowMs };
  }

  state.count += 1;
  return {
    allowed: state.count <= limit,
    remaining: Math.max(0, limit - state.count),
    resetMs: state.windowStart + windowMs,
  };
}

/**
 * Extract the best-available client IP from a Next.js Request.
 * Vercel sets X-Forwarded-For; fallback to X-Real-IP.
 */
export function getClientIp(req: Request): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}
