export interface RateLimitPolicy {
  perMinute?: number
  perDay?: number
}

export interface KVStore {
  get(key: string): Promise<string | null>
  put(key: string, value: string, opts?: { expirationTtl?: number }): Promise<void>
}

export interface RateLimitOpts {
  providerId: string
  policy: RateLimitPolicy
  kv: KVStore
}

export async function checkRateLimit(opts: RateLimitOpts): Promise<void> {
  const { providerId, policy, kv } = opts
  const now = Date.now()
  const minuteBucket = Math.floor(now / 60000)
  const dayBucket = Math.floor(now / 86400000)

  if (policy.perMinute !== undefined) {
    const key = `provider:rate:${providerId}:m:${minuteBucket}`
    const val = await kv.get(key)
    const count = val ? Number(val) : 0
    if (count >= policy.perMinute) {
      const err = new Error(`Rate limit exceeded for provider '${providerId}': ${policy.perMinute}/min`)
      ;(err as unknown as Record<string, unknown>).code = 'PROVIDER_RATE_LIMITED'
      ;(err as unknown as Record<string, unknown>).retryAfterSeconds = 60 - (now % 60000) / 1000
      throw err
    }
    await kv.put(key, String(count + 1), { expirationTtl: 120 })
  }

  if (policy.perDay !== undefined) {
    const key = `provider:rate:${providerId}:d:${dayBucket}`
    const val = await kv.get(key)
    const count = val ? Number(val) : 0
    if (count >= policy.perDay) {
      const err = new Error(`Rate limit exceeded for provider '${providerId}': ${policy.perDay}/day`)
      ;(err as unknown as Record<string, unknown>).code = 'PROVIDER_RATE_LIMITED'
      ;(err as unknown as Record<string, unknown>).retryAfterSeconds = 86400 - (now % 86400000) / 1000
      throw err
    }
    await kv.put(key, String(count + 1), { expirationTtl: 172800 })
  }
}
