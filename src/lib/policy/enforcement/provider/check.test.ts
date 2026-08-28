import { describe, expect, it } from 'vitest'
import { checkProvider } from './check'
import { matchesRegion } from './region-matcher'

describe('matchesRegion', () => {
  it('matches exact region', () => {
    expect(matchesRegion('us-east-1', 'us-east-1')).toBe(true)
  })
  it('matches wildcard', () => {
    expect(matchesRegion('us-east-1', 'us-*')).toBe(true)
    expect(matchesRegion('eu-west-1', 'us-*')).toBe(false)
  })
})

describe('checkProvider', () => {
  it('allows when no policy', () => {
    expect(checkProvider({ id: 'openai' }, undefined)).toEqual({ allowed: true })
  })
  it('denies denylist first', () => {
    const result = checkProvider({ id: 'openai' }, { denylist: ['openai'] })
    expect(result).toEqual({ allowed: false, reason: 'in_denylist' })
  })
  it('denies when not in allowlist', () => {
    const result = checkProvider({ id: 'openai' }, { allowlist: ['anthropic'] })
    expect(result).toEqual({ allowed: false, reason: 'not_in_allowlist' })
  })
  it('allows when in allowlist', () => {
    const result = checkProvider({ id: 'openai' }, { allowlist: ['openai', 'anthropic'] })
    expect(result).toEqual({ allowed: true })
  })
  it('checks region via wildcard', () => {
    const result = checkProvider({ id: 'openai', region: 'eu-west-1' }, { allowlist: ['openai'], region: 'us-*' })
    expect(result).toEqual({ allowed: false, reason: 'region_mismatch' })
  })
})
