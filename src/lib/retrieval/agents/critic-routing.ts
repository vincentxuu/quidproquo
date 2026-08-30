import type { Critique, GraphState, ValidationResult } from '../state'
import { countUniquePostResults } from '../search-result-format'
import { isBroadArticleCatalogQuery } from '../query-strategy'
import { extractMarkdownUrls } from './validation'

export const MAX_DRAFT_ATTEMPTS = 3
export const MIN_DETERMINISTIC_CATALOG_SOURCES = 4

export function hasCriticFailure(critique: Critique): boolean {
  return (
    critique.confidence < 0.6 ||
    critique.answer_relevance < 0.75 ||
    critique.intent_alignment < 0.75 ||
    critique.drift_detected ||
    critique.ungrounded_claims.length > 0
  )
}

export function hasValidationFailure(validation: ValidationResult): boolean {
  return !validation.passed
}

export function shouldRetry(state: Pick<GraphState, 'iteration' | 'critique' | 'validation'>): boolean {
  const failed = hasValidationFailure(state.validation) || hasCriticFailure(state.critique)
  return failed && state.iteration < MAX_DRAFT_ATTEMPTS
}

export function shouldDegrade(state: Pick<GraphState, 'iteration' | 'critique' | 'validation'>): boolean {
  const failed = hasValidationFailure(state.validation) || hasCriticFailure(state.critique)
  return failed && state.iteration >= MAX_DRAFT_ATTEMPTS
}

export function shouldAcceptReviewedCatalogDraft(
  state: Pick<GraphState, 'critique' | 'draft' | 'messages' | 'plan' | 'search_results' | 'validation'>
): boolean {
  if (!state.validation.passed || state.plan.intent !== 'recommendation') return false
  if (
    state.critique.answer_relevance < 0.75 ||
    state.critique.intent_alignment < 0.75 ||
    state.critique.drift_detected ||
    state.critique.ungrounded_claims.length > 0
  ) return false

  const lastMessage = state.messages.at(-1)
  const query = typeof lastMessage?.content === 'string' ? lastMessage.content : ''
  if (!isBroadArticleCatalogQuery(query)) return false
  if (countUniquePostResults(state.search_results) < MIN_DETERMINISTIC_CATALOG_SOURCES) return false

  const allowedUrls = new Set(state.search_results.map(result => result.source_url))
  const draftUrls = extractMarkdownUrls(state.draft).citationUrls
  if (draftUrls.some(url => !allowedUrls.has(url))) return false
  const citedUrls = new Set(draftUrls)
  return citedUrls.size >= MIN_DETERMINISTIC_CATALOG_SOURCES
}
