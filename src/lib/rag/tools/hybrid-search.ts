export { EMBED_BATCH_SIZE, EMBED_MODEL } from '../embedding'
export const RRF_K = 60
export const BM25_SHORT_CIRCUIT_THRESHOLD = 5
export const ABSTRACT_RANKING_WEIGHT = 0.5
export const WEAK_RETRIEVAL_THRESHOLD = 0.4

export interface SearchMetrics {
  source: 'posts' | 'docs'
  query_kind: 'precision' | 'general'
  bm25_results: number
  vector_results: number
  result_count: number
  bm25_ms: number
  vector_ms: number | null
  total_ms: number
  skipped_vector: boolean
  short_circuit_threshold: number
  estimated_latency_saved_ms: number | null
}

export type SearchResultsWithMetrics<T> = T[] & { metrics?: SearchMetrics }

interface ChunkIdentified {
  chunk_id: string
}

interface ScoredResult {
  relevance_score: number
  type?: string
}

function clampUnitScore(score: number): number {
  if (!Number.isFinite(score)) return 0
  return Math.min(1, Math.max(0, score))
}

/**
 * Abstract search exposes a cosine score while post/doc search exposes a
 * normalized RRF score. Keep both on the same 0..1 ranking scale, but treat an
 * abstract match as one retrieval channel so it cannot outrank agreement
 * between BM25 and vector search by score range alone.
 */
export function comparableRankingScore(result: ScoredResult): number {
  const score = clampUnitScore(result.relevance_score)
  return result.type === 'abstract' ? score * ABSTRACT_RANKING_WEIGHT : score
}

export function isWeakRetrieval(
  results: ScoredResult[],
  threshold = WEAK_RETRIEVAL_THRESHOLD
): boolean {
  const maxScore = results.reduce(
    (max, result) => Math.max(max, comparableRankingScore(result)),
    0
  )
  return maxScore < threshold
}

export function buildFtsQuery(query: string): string | null {
  const normalized = query.trim().replace(/["']/g, ' ')
  if (!normalized) return null

  const rawTokens = normalized.match(/[\p{L}\p{N}][\p{L}\p{N}-]*/gu) ?? []
  const tokens = Array.from(new Set(rawTokens.map(token => token.trim()).filter(token => token.length >= 2)))
  if (tokens.length === 0) return null

  const expanded = new Set<string>(tokens)
  for (const token of tokens) {
    if (/^[\p{Script=Han}]+$/u.test(token) && token.length === 2) {
      for (const ch of token) {
        expanded.add(ch)
      }
    }
  }

  return [...expanded]
    .map(token => `"${token.replace(/"/g, '""')}"`)
    .join(' OR ')
}

export function isPrecisionQuery(query: string): boolean {
  const tokens = query.match(/[\p{L}\p{N}][\p{L}\p{N}._:/#-]*/gu) ?? []
  return tokens.some(token =>
    /\d/.test(token) ||
    /[._:/#-]/.test(token) ||
    /^[A-Z][A-Z0-9_-]{1,}$/.test(token)
  )
}

export function shouldShortCircuitBm25(
  bm25ResultCount: number,
  enabled = true,
  threshold = BM25_SHORT_CIRCUIT_THRESHOLD
): boolean {
  return enabled && bm25ResultCount >= threshold
}

export function shouldUseBm25ShortCircuit(
  query: string,
  bm25ResultCount: number,
  enabled = true,
  threshold = BM25_SHORT_CIRCUIT_THRESHOLD
): boolean {
  return isPrecisionQuery(query)
    && shouldShortCircuitBm25(bm25ResultCount, enabled, threshold)
}

export function attachSearchMetrics<T>(
  results: T[],
  metrics: SearchMetrics
): SearchResultsWithMetrics<T> {
  Object.defineProperty(results, 'metrics', {
    value: metrics,
    enumerable: false,
    configurable: true,
  })
  return results as SearchResultsWithMetrics<T>
}

export function getSearchMetrics<T>(results: T[]): SearchMetrics | undefined {
  return (results as SearchResultsWithMetrics<T>).metrics
}

export function collectSearchMetrics<T>(resultSets: T[][]): SearchMetrics[] {
  return resultSets
    .map(resultSet => getSearchMetrics(resultSet))
    .filter((metrics): metrics is SearchMetrics => Boolean(metrics))
}

export function reciprocalRankFuse<T extends ChunkIdentified>(
  rankedLists: T[][],
  limit: number,
  k = RRF_K
): Array<T & { relevance_score: number }> {
  const merged = new Map<string, { row: T; score: number }>()
  const activeListCount = rankedLists.filter(list => list.length > 0).length

  for (const list of rankedLists) {
    list.forEach((row, index) => {
      const rank = index + 1
      const contribution = 1 / (k + rank)
      const existing = merged.get(row.chunk_id)

      if (existing) {
        existing.score += contribution
        existing.row = { ...existing.row, ...row }
      } else {
        merged.set(row.chunk_id, { row, score: contribution })
      }
    })
  }

  const maxPossibleScore = activeListCount / (k + 1)

  return [...merged.values()]
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ row, score }) => ({
      ...row,
      relevance_score: maxPossibleScore > 0 ? score / maxPossibleScore : 0,
    }))
}
