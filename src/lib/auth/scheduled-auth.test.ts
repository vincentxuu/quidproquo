import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('./session', () => ({
  verifySession: vi.fn(),
}))

import { verifySession } from './session'
import { getRequestSource, requireScheduledAuth, UnauthorizedError } from './scheduled-auth'

function cookies(token?: string) {
  return {
    get: vi.fn(() => token ? { value: token } : undefined),
  }
}

function request(secret?: string): Request {
  return new Request('https://example.test', {
    headers: secret ? { 'X-Crawl-Secret': secret } : {},
  })
}

describe('scheduled auth', () => {
  beforeEach(() => {
    vi.mocked(verifySession).mockReset()
  })

  it('returns admin for valid session', async () => {
    vi.mocked(verifySession).mockResolvedValue(true)
    await expect(getRequestSource(cookies('token'), request('wrong'), { CRAWL_SECRET: 'secret' })).resolves.toBe('admin')
  })

  it('returns cron for valid crawl secret', async () => {
    vi.mocked(verifySession).mockResolvedValue(false)
    await expect(getRequestSource(cookies(), request('secret'), { CRAWL_SECRET: 'secret' })).resolves.toBe('cron')
  })

  it('returns undefined for missing auth', async () => {
    await expect(getRequestSource(cookies(), request('wrong'), { CRAWL_SECRET: 'secret' })).resolves.toBeUndefined()
  })

  it('throws in requireScheduledAuth when unauthenticated', async () => {
    await expect(requireScheduledAuth(cookies(), request(), {})).rejects.toBeInstanceOf(UnauthorizedError)
  })
})
