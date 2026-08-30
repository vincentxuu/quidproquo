import { describe, expect, it } from 'vitest'
import { POST } from './chat'

describe('POST /api/chat request policy', () => {
  it('rejects a public semantic-cache bypass before consuming retrieval quota', async () => {
    const response = await POST({
      request: new Request('https://quidproquo.cc/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: '有哪些課程文章',
          traceScope: 'eval',
          cacheMode: 'bypass',
        }),
      }),
      cookies: { get: () => undefined },
      clientAddress: '203.0.113.10',
    } as never)

    expect(response.status).toBe(403)
    await expect(response.json()).resolves.toMatchObject({ error: 'cache_bypass_forbidden' })
  })
})
