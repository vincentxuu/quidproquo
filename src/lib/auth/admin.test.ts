import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('./session', () => ({
  verifySession: vi.fn(),
}))

import { verifySession } from './session'
import { requireAdmin } from './admin'

function cookies(token?: string) {
  return {
    get: vi.fn(() => token ? { value: token } : undefined),
  }
}

describe('requireAdmin', () => {
  beforeEach(() => {
    vi.mocked(verifySession).mockReset()
  })

  it('returns unauthorized when session cookie is missing', async () => {
    const result = await requireAdmin(cookies())
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.response.status).toBe(401)
      expect(await result.response.json()).toEqual({ error: 'unauthorized' })
    }
    expect(verifySession).not.toHaveBeenCalled()
  })

  it('returns unauthorized when token is invalid', async () => {
    vi.mocked(verifySession).mockResolvedValue(false)
    const result = await requireAdmin(cookies('bad'))
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.response.status).toBe(401)
  })

  it('returns ok when token is valid', async () => {
    vi.mocked(verifySession).mockResolvedValue(true)
    await expect(requireAdmin(cookies('good'))).resolves.toEqual({ ok: true })
  })
})
