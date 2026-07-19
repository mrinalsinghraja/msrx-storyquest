/**
 * Fixed-window rate limiter, held in process memory.
 *
 * WHAT THIS DOES AND DOES NOT PROTECT
 *
 * `/api/story` calls a metered third-party model. Before this existed the route
 * was open: anyone could POST it in a loop and every request became a paid Groq
 * completion with a 15s budget and one retry. The cost of abuse was a shell
 * loop; the cost of being abused was the account's quota.
 *
 * The store is a `Map` in the running process, which on a serverless platform
 * means *per instance*, not global. An attacker spread across enough cold starts
 * gets a multiple of the nominal limit. That is a real weakness and this is
 * deliberately not sold as airtight: it converts unbounded abuse into abuse that
 * scales with instance count, which is the difference between a bill and an
 * inconvenience. A shared store (Redis, Upstash) is the actual fix and wants a
 * network dependency this app does not otherwise have.
 *
 * It is also not a security boundary against a determined attacker who can
 * forge `x-forwarded-for` — see `clientKey` below.
 */

/** @type {Map<string, { count: number, resetAt: number }>} */
const windows = new Map();

/** Upper bound on distinct tracked clients before the store is dropped wholesale. */
const MAX_KEYS = 20_000;
/** Minimum gap between full scans. */
const SWEEP_INTERVAL_MS = 1_000;

let lastSweep = 0;

/**
 * Reclaims expired entries, at most once per second.
 *
 * The scan is O(n) over tracked clients, so running it on *every* request turns
 * a large map into a per-request cost — which hands an attacker a cheap way to
 * make the limiter itself the bottleneck. Throttling the scan keeps the amortised
 * cost flat regardless of how fast requests arrive.
 *
 * `MAX_KEYS` is the backstop for the case the throttle cannot cover: a burst of
 * distinct keys arriving faster than one sweep per second. Clearing outright
 * rather than evicting selectively means a caller mid-window gets their count
 * reset — it forgives some requests it should have refused. That is the correct
 * direction to fail: a limiter that occasionally under-counts under a synthetic
 * flood beats one that can be grown until it stalls the route it protects.
 */
function sweep(now) {
  if (windows.size > MAX_KEYS) {
    windows.clear();
    lastSweep = now;
    return;
  }
  if (now - lastSweep < SWEEP_INTERVAL_MS) return;
  lastSweep = now;
  for (const [key, entry] of windows) {
    if (entry.resetAt <= now) windows.delete(key);
  }
}

/**
 * Derives the limiter key from the proxy's forwarded address.
 *
 * `x-forwarded-for` is client-controllable in general, but on Vercel the edge
 * rewrites it and the left-most entry is the real peer, so it is trustworthy
 * *behind that proxy specifically*. Running this app on bare Node with no proxy
 * in front would make the header spoofable and the limiter bypassable.
 *
 * A request with no forwarded address at all shares the `unknown` bucket rather
 * than getting a free pass, so a stripped header costs the caller its own limit
 * instead of removing it.
 */
export function clientKey(request) {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim().slice(0, 64);
  return request.headers.get('x-real-ip')?.slice(0, 64) || 'unknown';
}

/** Live entry count. Exists so the sweep can be asserted rather than assumed. */
export const trackedKeys = () => windows.size;

/**
 * Consumes one token for `key`.
 *
 * Returns the decision plus the numbers a `429` needs to be honest about when
 * the caller may try again.
 */
export function rateLimit(key, { limit = 10, windowMs = 60_000 } = {}) {
  const now = Date.now();
  sweep(now);

  const entry = windows.get(key);
  if (!entry || entry.resetAt <= now) {
    const resetAt = now + windowMs;
    windows.set(key, { count: 1, resetAt });
    return { ok: true, remaining: limit - 1, resetAt, retryAfter: 0 };
  }

  entry.count += 1;
  const remaining = Math.max(0, limit - entry.count);
  return {
    ok: entry.count <= limit,
    remaining,
    resetAt: entry.resetAt,
    retryAfter: Math.max(1, Math.ceil((entry.resetAt - now) / 1000)),
  };
}
