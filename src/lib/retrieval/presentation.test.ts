import { describe, expect, it } from 'vitest'
import { initialState, type GraphState } from './state'
import { shouldExposeRetrievedLinks } from './presentation'

describe('shouldExposeRetrievedLinks', () => {
  it('shows retrieved links for grounded answers', () => {
    expect(shouldExposeRetrievedLinks(makeState({}))).toBe(true)
  })

  it('hides retrieved links for low-confidence answers', () => {
    expect(shouldExposeRetrievedLinks(makeState({
      critique: {
        confidence: 0.52,
        answer_relevance: 0.9,
        intent_alignment: 0.9,
        drift_detected: false,
        ungrounded_claims: [],
        gaps: [],
      },
    }))).toBe(false)
  })

  it('hides retrieved links when validation failed', () => {
    expect(shouldExposeRetrievedLinks(makeState({
      validation: { passed: false, errors: ['citation outside retrieved sources'] },
    }))).toBe(false)
  })
})

function makeState(overrides: Partial<GraphState>): GraphState {
  return {
    ...initialState(),
    search_results: [{
      claim: 'claim',
      evidence_excerpt: 'evidence',
      source_url: 'https://quidproquo.cc/posts/example',
      chunk_id: 'chunk-1',
      date: '2026-08-29',
      relevance_score: 0.9,
      images: [],
      links: [],
      type: 'post',
      slug: 'example',
      title: 'Example',
    }],
    ...overrides,
  }
}
