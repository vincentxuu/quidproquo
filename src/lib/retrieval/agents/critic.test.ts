import { describe, it, expect } from 'vitest'
import { MAX_DRAFT_ATTEMPTS, shouldDegrade, shouldRetry } from './critic-routing'

describe('critic routing', () => {
  it('retries when confidence is low', () => {
    expect(shouldRetry({
      iteration: 1,
      critique: { confidence: 0.5, answer_relevance: 1, intent_alignment: 1, drift_detected: false, ungrounded_claims: [], gaps: [] },
      validation: { passed: true, errors: [] },
    })).toBe(true)
  })

  it('retries when there are ungrounded claims', () => {
    expect(shouldRetry({
      iteration: 1,
      critique: { confidence: 0.8, answer_relevance: 1, intent_alignment: 1, drift_detected: false, ungrounded_claims: ['claim x'], gaps: [] },
      validation: { passed: true, errors: [] },
    })).toBe(true)
  })

  it('retries when deterministic validation fails', () => {
    expect(shouldRetry({
      iteration: 1,
      critique: { confidence: 0.9, answer_relevance: 1, intent_alignment: 1, drift_detected: false, ungrounded_claims: [], gaps: [] },
      validation: { passed: false, errors: ['Unknown citation URL'] },
    })).toBe(true)
  })

  it('does not retry when quality checks pass', () => {
    expect(shouldRetry({
      iteration: 1,
      critique: { confidence: 0.7, answer_relevance: 0.8, intent_alignment: 0.8, drift_detected: false, ungrounded_claims: [], gaps: [] },
      validation: { passed: true, errors: [] },
    })).toBe(false)
  })

  it('retries when answer relevance is low', () => {
    expect(shouldRetry({
      iteration: 1,
      critique: { confidence: 0.9, answer_relevance: 0.6, intent_alignment: 0.9, drift_detected: false, ungrounded_claims: [], gaps: [] },
      validation: { passed: true, errors: [] },
    })).toBe(true)
  })

  it('retries when drift is detected', () => {
    expect(shouldRetry({
      iteration: 1,
      critique: { confidence: 0.9, answer_relevance: 0.9, intent_alignment: 0.6, drift_detected: true, ungrounded_claims: [], gaps: [] },
      validation: { passed: true, errors: [] },
    })).toBe(true)
  })

  it('degrades instead of retrying after max attempts', () => {
    const state = {
      iteration: MAX_DRAFT_ATTEMPTS,
      critique: { confidence: 0.3, answer_relevance: 0.4, intent_alignment: 0.4, drift_detected: true, ungrounded_claims: [], gaps: [] },
      validation: { passed: true, errors: [] },
    }

    expect(shouldRetry(state)).toBe(false)
    expect(shouldDegrade(state)).toBe(true)
  })
})
