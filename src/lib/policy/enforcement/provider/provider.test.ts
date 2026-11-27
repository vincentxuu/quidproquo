import { describe, it, expect } from 'vitest'
import { checkProvider } from './check'
import { wireProviderEnforcement } from './wire'

describe('provider policy enforcement — checkProvider', () => {
  it('allows provider in allowlist', () => {
    const result = checkProvider({ id: 'llm.openrouter' }, { allowlist: ['llm.openrouter'] })
    expect(result).toEqual({ allowed: true })
  })

  it('denies provider not in allowlist', () => {
    const result = checkProvider({ id: 'llm.openai' }, { allowlist: ['llm.openrouter'] })
    expect(result).toEqual({ allowed: false, reason: 'not_in_allowlist' })
  })

  it('allows all providers when allowlist is undefined', () => {
    const result = checkProvider({ id: 'llm.openai' }, {})
    expect(result).toEqual({ allowed: true })
  })

  it('denies provider in denylist regardless of allowlist', () => {
    const result = checkProvider(
      { id: 'llm.openai' },
      { allowlist: ['llm.openai', 'llm.openrouter'], denylist: ['llm.openai'] },
    )
    expect(result).toEqual({ allowed: false, reason: 'in_denylist' })
  })

  it('denies when region does not match', () => {
    const result = checkProvider(
      { id: 'llm.openrouter', region: 'eu-west-1' },
      { allowlist: ['llm.openrouter'], region: 'us-*' },
    )
    expect(result).toEqual({ allowed: false, reason: 'region_mismatch' })
  })

  it('denies on data residency mismatch', () => {
    const result = checkProvider(
      { id: 'llm.openrouter', dataResidency: 'eu' },
      { allowlist: ['llm.openrouter'], data_residency: 'us' },
    )
    expect(result).toEqual({ allowed: false, reason: 'residency_mismatch' })
  })

  it('allows when no policy provided', () => {
    const result = checkProvider({ id: 'llm.openai' }, undefined)
    expect(result).toEqual({ allowed: true })
  })
})

describe('provider policy enforcement — wireProviderEnforcement', () => {
  it('allows provider when no policy', () => {
    const wire = wireProviderEnforcement(undefined)
    expect(wire.checkBeforeDispatch('llm.openai')).toEqual({ allowed: true })
  })

  it('allows provider in allowlist', () => {
    const wire = wireProviderEnforcement({ allowlist: ['llm.openrouter'] })
    expect(wire.checkBeforeDispatch('llm.openrouter')).toEqual({ allowed: true })
  })

  it('denies provider not in allowlist with no fallback', () => {
    const wire = wireProviderEnforcement({ allowlist: ['llm.openrouter'] })
    expect(wire.checkBeforeDispatch('llm.openai')).toEqual({ allowed: false })
  })

  it('falls back to first allowed provider in fallback_chain', () => {
    const wire = wireProviderEnforcement({
      allowlist: ['llm.openrouter'],
      fallback_chain: ['llm.anthropic', 'llm.openrouter'],
    })
    const result = wire.checkBeforeDispatch('llm.openai')
    expect(result.allowed).toBe(true)
    expect(result.fallbackId).toBe('llm.openrouter')
  })
})
