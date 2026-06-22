// ─── Rate Limiter Sederhana (In-Memory Map) ───────────────────────
// Catatan: Menggunakan Map di memori. Akan hilang saat server restart.
// Untuk production, gunakan Redis atau database.

const rateMap = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(
  key: string,
  maxRequests = 10,
  windowMs = 60000
): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const entry = rateMap.get(key);

  if (!entry || now > entry.resetAt) {
    rateMap.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: maxRequests - 1 };
  }

  if (entry.count >= maxRequests) {
    return { allowed: false, remaining: 0 };
  }

  entry.count++;
  return { allowed: true, remaining: maxRequests - entry.count };
}

// Helper untuk mendapatkan key dari request
export function getRateLimitKey(
  request: Request,
  method?: string
): string {
  const methodStr = method || request.method;
  const url = new URL(request.url);
  const pathname = url.pathname;
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "127.0.0.1";
  return `${methodStr}:${pathname}:${ip}`;
}

// Cleanup stale entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateMap.entries()) {
    if (now > entry.resetAt) rateMap.delete(key);
  }
}, 300000);
