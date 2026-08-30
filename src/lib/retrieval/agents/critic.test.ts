import { describe, it, expect } from 'vitest'
import { HumanMessage } from '@langchain/core/messages'
import type { GraphState, RagMessage, SearchResult } from '../state'
import { MAX_DRAFT_ATTEMPTS, shouldAcceptReviewedCatalogDraft, shouldDegrade, shouldRetry } from './critic-routing'

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

  it('accepts a validated broad catalog draft with four retrieved citations', () => {
    const searchResults = ['stanford', 'mit', 'cmu', 'berkeley'].map(slug => ({
      chunk_id: slug,
      source_url: `https://quidproquo.cc/posts/learning/${slug}`,
      slug: `learning/${slug}`,
      type: 'post',
    })) as SearchResult[]
    const draft = searchResults.map(result => `[${result.slug}](${result.source_url})`).join('\n')

    expect(shouldAcceptReviewedCatalogDraft({
      critique: { confidence: 0.55, answer_relevance: 0.9, intent_alignment: 0.9, drift_detected: false, ungrounded_claims: [], gaps: [] },
      draft,
      messages: [new HumanMessage('有哪些課程文章')] as RagMessage[],
      plan: { intent: 'recommendation', complexity: 'simple', needs_clarification: false, subtasks: [], specialists: [] },
      search_results: searchResults,
      validation: { passed: true, errors: [] },
    } as Pick<GraphState, 'critique' | 'draft' | 'messages' | 'plan' | 'search_results' | 'validation'>)).toBe(true)
  })

  it('keeps critic review when a catalog draft cites fewer than four sources', () => {
    const searchResults = ['stanford', 'mit', 'cmu', 'berkeley'].map(slug => ({
      chunk_id: slug,
      source_url: `https://quidproquo.cc/posts/learning/${slug}`,
      slug: `learning/${slug}`,
      type: 'post',
    })) as SearchResult[]

    expect(shouldAcceptReviewedCatalogDraft({
      critique: { confidence: 0.55, answer_relevance: 0.9, intent_alignment: 0.9, drift_detected: false, ungrounded_claims: [], gaps: [] },
      draft: `[Stanford](${searchResults[0].source_url})`,
      messages: [new HumanMessage('有哪些課程文章')] as RagMessage[],
      plan: { intent: 'recommendation', complexity: 'simple', needs_clarification: false, subtasks: [], specialists: [] },
      search_results: searchResults,
      validation: { passed: true, errors: [] },
    } as Pick<GraphState, 'critique' | 'draft' | 'messages' | 'plan' | 'search_results' | 'validation'>)).toBe(false)
  })

  it.each([
    ['low relevance', { answer_relevance: 0.7 }],
    ['low intent alignment', { intent_alignment: 0.7 }],
    ['drift', { drift_detected: true }],
    ['ungrounded prose', { ungrounded_claims: ['unsupported introduction'] }],
  ])('keeps retrying catalog drafts with %s', (_name, critiqueOverride) => {
    const searchResults = ['stanford', 'mit', 'cmu', 'berkeley'].map(slug => ({
      chunk_id: slug,
      source_url: `https://quidproquo.cc/posts/learning/${slug}`,
      slug: `learning/${slug}`,
      type: 'post',
    })) as SearchResult[]

    expect(shouldAcceptReviewedCatalogDraft({
      critique: {
        confidence: 0.55,
        answer_relevance: 0.9,
        intent_alignment: 0.9,
        drift_detected: false,
        ungrounded_claims: [],
        gaps: [],
        ...critiqueOverride,
      },
      draft: searchResults.map(result => `[${result.slug}](${result.source_url})`).join('\n'),
      messages: [new HumanMessage('有哪些課程文章')] as RagMessage[],
      plan: { intent: 'recommendation', complexity: 'simple', needs_clarification: false, subtasks: [], specialists: [] },
      search_results: searchResults,
      validation: { passed: true, errors: [] },
    } as Pick<GraphState, 'critique' | 'draft' | 'messages' | 'plan' | 'search_results' | 'validation'>)).toBe(false)
  })
})
