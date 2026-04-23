import { env } from 'cloudflare:workers'

interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetAt: string
}

function todayKey(ip: string): string {
  const d = new Date()
  return `rate:${ip}:${d.toISOString().slice(0, 10)}`
}

function secondsUntilMidnight(): number {
  const now = new Date()
  const midnight = new Date(now)
  midnight.setUTCHours(24, 0, 0, 0)
  return Math.floor((midnight.getTime() - now.getTime()) / 1000)
}

export async function checkAndIncrementRateLimit(
  ip: string,
  limit: number,
  kv?: KVNamespace
): Promise<RateLimitResult> {
  const store = kv ?? (env as unknown as { RATE: KVNamespace }).RATE
  const key = todayKey(ip)
  const current = parseInt((await store.get(key)) ?? '0', 10)

  const tomorrow = new Date()
  tomorrow.setUTCHours(24, 0, 0, 0)
  const resetAt = tomorrow.toISOString()

  if (current >= limit) {
    return { allowed: false, remaining: 0, resetAt }
  }

  await store.put(key, String(current + 1), { expirationTtl: secondsUntilMidnight() + 60 })
  return { allowed: true, remaining: limit - current - 1, resetAt }
}
