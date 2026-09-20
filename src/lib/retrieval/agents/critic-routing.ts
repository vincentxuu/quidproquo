import type { Critique, GraphState, ValidationResult } from '../state'
import { countUniquePostResults } from '../search-result-format'
import { isBroadArticleCatalogQuery } from '../query-strategy'
import { extractMarkdownUrls, normalizeCitationUrl } from './validation'

/**
 * 草稿最多寫幾輪。原本 3，但 iteration > 0 會關掉 BM25 short-circuit 改跑完整 hybrid
 * 檢索（vector + docs + abstract + HyDE + multi-query 同時發），第三輪在 prod 把
 * Worker 128 MB 記憶體吃爆（wrangler tail: exceededMemory），串流無聲斷掉。
 * 兩輪已經涵蓋「重寫一次」；第二輪還不過就走 fallback 給讀者看得到的答案。
 */
export const MAX_DRAFT_ATTEMPTS = 2
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

  const allowedUrls = new Set(state.search_results.map(result => normalizeCitationUrl(result.source_url)))
  const draftUrls = extractMarkdownUrls(state.draft).citationUrls.map(normalizeCitationUrl)
  if (draftUrls.some(url => !allowedUrls.has(url))) return false
  const citedUrls = new Set(draftUrls)
  return citedUrls.size >= MIN_DETERMINISTIC_CATALOG_SOURCES
}
