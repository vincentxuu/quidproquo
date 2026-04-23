import { describe, it, expect } from 'vitest'
import { shouldRetry } from './critic-routing'

describe('critic routing', () => {
  it('retries when confidence is low', () => {
    expect(shouldRetry({ confidence: 0.5, ungrounded_claims: [], gaps: [] }, 0)).toBe(true)
  })

  it('retries when there are ungrounded claims', () => {
    expect(shouldRetry({ confidence: 0.8, ungrounded_claims: ['claim x'], gaps: [] }, 0)).toBe(true)
  })

  it('does not retry when confidence is high and no ungrounded claims', () => {
    expect(shouldRetry({ confidence: 0.7, ungrounded_claims: [], gaps: [] }, 0)).toBe(false)
  })

  it('does not retry when max iterations reached', () => {
    expect(shouldRetry({ confidence: 0.3, ungrounded_claims: [], gaps: [] }, 2)).toBe(false)
  })
})
