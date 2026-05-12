import { describe, it, expect } from 'vitest'
import { shouldRetry } from './critic-routing'
import type { Critique } from '../state'

function critique(overrides: Partial<Critique>): Critique {
  return {
    confidence: 1,
    answer_relevance: 1,
    intent_alignment: 1,
    drift_detected: false,
    ungrounded_claims: [],
    gaps: [],
    ...overrides,
  }
}

describe('critic routing', () => {
  it('retries when confidence is low', () => {
    expect(shouldRetry(critique({ confidence: 0.5 }), 0)).toBe(true)
  })

  it('retries when there are ungrounded claims', () => {
    expect(shouldRetry(critique({ confidence: 0.8, ungrounded_claims: ['claim x'] }), 0)).toBe(true)
  })

  it('does not retry when confidence is high and no ungrounded claims', () => {
    expect(shouldRetry(critique({ confidence: 0.7 }), 0)).toBe(false)
  })

  it('does not retry when max iterations reached', () => {
    expect(shouldRetry(critique({ confidence: 0.3 }), 2)).toBe(false)
  })
})
