import { describe, it, expect, vi } from 'vitest'
import { checkAndIncrementRateLimit } from './rate-limit'

function makeKV(initial: string | null = null) {
  let value = initial
  return {
    get: vi.fn(async () => value),
    put: vi.fn(async (_key: string, v: string) => { value = v }),
  }
}

describe('rate limit', () => {
  it('allows request when under limit', async () => {
    const kv = makeKV('2')
    const result = await checkAndIncrementRateLimit('1.2.3.4', 5, kv as unknown as KVNamespace)
    expect(result.allowed).toBe(true)
    expect(result.remaining).toBe(2)
  })

  it('blocks request when at limit', async () => {
    const kv = makeKV('5')
    const result = await checkAndIncrementRateLimit('1.2.3.4', 5, kv as unknown as KVNamespace)
    expect(result.allowed).toBe(false)
    expect(result.remaining).toBe(0)
  })

  it('allows first request (no existing count)', async () => {
    const kv = makeKV(null)
    const result = await checkAndIncrementRateLimit('1.2.3.4', 5, kv as unknown as KVNamespace)
    expect(result.allowed).toBe(true)
    expect(result.remaining).toBe(4)
  })
})
