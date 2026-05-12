export const EMBED_MODEL = '@cf/baai/bge-large-en-v1.5'
export const EMBED_BATCH_SIZE = 50
export const RRF_K = 60
export const BM25_SHORT_CIRCUIT_THRESHOLD = 5

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

export function buildFtsQuery(query: string): string | null {
  const normalized = query.trim().replace(/["']/g, ' ')
  if (!normalized) return null

  const rawTokens = normalized.match(/[\p{L}\p{N}][\p{L}\p{N}-]*/gu) ?? []
  const tokens = Array.from(new Set(rawTokens.map(token => token.trim()).filter(token => token.length >= 2)))
  if (tokens.length === 0) return null

  return tokens
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

  return [...merged.values()]
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ row, score }) => ({ ...row, relevance_score: score }))
}
