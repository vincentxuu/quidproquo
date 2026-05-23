import { describe, it, expect } from 'vitest'
import { overlayRetry } from './overlay'
import { handleExhaustion } from './exhaustion'
import { overlayRetryFromPolicy } from '../../../agent-flow/runtime/retry'

describe('overlayRetry (enforcement/retry/overlay)', () => {
  it('returns step config unchanged when no policy retry provided', () => {
    const step = { max_attempts: 3, backoff_base_ms: 1000 }
    const result = overlayRetry(step, undefined)
    expect(result).toEqual(step)
  })

  it('overrides step config fields with policy retry values', () => {
    const step = { max_attempts: 3, backoff_base_ms: 1000 }
    const policy = { max_attempts: 2, backoff_base_ms: 50 }
    const result = overlayRetry(step, policy)
    expect(result?.max_attempts).toBe(2)
    expect(result?.backoff_base_ms).toBe(50)
  })

  it('returns undefined when both step and policy are undefined', () => {
    const result = overlayRetry(undefined, undefined)
    expect(result).toBeUndefined()
  })

  it('returns policy when step config is undefined', () => {
    const policy = { max_attempts: 5, on_exhaustion: 'skip' as const }
    const result = overlayRetry(undefined, policy)
    expect(result).toEqual(policy)
  })

  it('preserves fallback_provider from policy', () => {
    const step = { max_attempts: 3 }
    const policy = { fallback_provider: 'llm.groq' }
    const result = overlayRetry(step, policy)
    expect(result?.fallback_provider).toBe('llm.groq')
  })

  it('preserves on_exhaustion from policy', () => {
    const step = { max_attempts: 3 }
    const policy = { on_exhaustion: 'skip' as const }
    const result = overlayRetry(step, policy)
    expect(result?.on_exhaustion).toBe('skip')
  })
})

describe('handleExhaustion (enforcement/retry/exhaustion)', () => {
  it('continues (skip) when on_exhaustion is skip', () => {
    const result = handleExhaustion({
      flowRunId: 'flow-1',
      stepRunId: 'step-1',
      error: new Error('timeout'),
      policyRetry: { on_exhaustion: 'skip' },
    })
    expect(result).toEqual({ continue: true })
  })

  it('does not continue when on_exhaustion is fail', () => {
    const result = handleExhaustion({
      flowRunId: 'flow-1',
      stepRunId: 'step-1',
      error: new Error('timeout'),
      policyRetry: { on_exhaustion: 'fail' },
    })
    expect(result).toEqual({ continue: false })
  })

  it('does not continue when no policy retry provided', () => {
    const result = handleExhaustion({
      flowRunId: 'flow-1',
      stepRunId: 'step-1',
      error: new Error('timeout'),
      policyRetry: undefined,
    })
    expect(result).toEqual({ continue: false })
  })
})

describe('overlayRetryFromPolicy (agent-flow/runtime/retry)', () => {
  it('uses base config when no policy retry provided', () => {
    const base = { maxAttempts: 3, backoffMs: 1000 }
    const result = overlayRetryFromPolicy(base)
    expect(result.maxAttempts).toBe(3)
    expect(result.backoffMs).toBe(1000)
  })

  it('overrides maxAttempts from policy', () => {
    const base = { maxAttempts: 3, backoffMs: 1000 }
    const result = overlayRetryFromPolicy(base, { max_attempts: 2, backoff_base_ms: 50 })
    expect(result.maxAttempts).toBe(2)
    expect(result.backoffMs).toBe(50)
  })

  it('sets onExhaustion from policy', () => {
    const base = { maxAttempts: 3, backoffMs: 1000 }
    const result = overlayRetryFromPolicy(base, { on_exhaustion: 'skip' })
    expect(result.onExhaustion).toBe('skip')
  })

  it('preserves fallbackProvider from policy', () => {
    const base = { maxAttempts: 3, backoffMs: 1000 }
    const result = overlayRetryFromPolicy(base, { fallback_provider: 'llm.groq' })
    expect(result.fallbackProvider).toBe('llm.groq')
  })

  it('preserves base config when policy fields are undefined', () => {
    const base = { maxAttempts: 3, backoffMs: 1000 }
    const result = overlayRetryFromPolicy(base, {})
    expect(result.maxAttempts).toBe(3)
    expect(result.backoffMs).toBe(1000)
    expect(result.onExhaustion).toBeUndefined()
    expect(result.fallbackProvider).toBeUndefined()
  })
})
