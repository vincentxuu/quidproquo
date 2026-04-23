import { describe, it, expect } from 'vitest'
import { generateToken, hashToken } from './session'

describe('session', () => {
  it('generates a 64-char hex token', async () => {
    const token = await generateToken()
    expect(token).toHaveLength(64)
    expect(token).toMatch(/^[0-9a-f]+$/)
  })

  it('generates different tokens each time', async () => {
    const a = await generateToken()
    const b = await generateToken()
    expect(a).not.toBe(b)
  })

  it('hashes token deterministically', async () => {
    const token = 'abc123'
    const h1 = await hashToken(token)
    const h2 = await hashToken(token)
    expect(h1).toBe(h2)
  })

  it('different inputs produce different hashes', async () => {
    expect(await hashToken('a')).not.toBe(await hashToken('b'))
  })
})
