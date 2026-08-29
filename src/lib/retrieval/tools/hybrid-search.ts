export { EMBED_BATCH_SIZE, EMBED_MODEL } from '../embedding'
export const RRF_K = 60
export const BM25_SHORT_CIRCUIT_THRESHOLD = 5
export const ABSTRACT_RANKING_WEIGHT = 0.5
export const WEAK_RETRIEVAL_THRESHOLD = 0.4

export interface SearchMetrics {
  source: 'posts' | 'docs' | 'ai_search'
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
  error?: string
  timeout?: boolean
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

  // 1) 先按空白/標點切大 token
  const rawTokens = normalized.match(/[\p{L}\p{N}][\p{L}\p{N}-]*/gu) ?? []
  const baseTokens = Array.from(new Set(rawTokens.map(token => token.trim()).filter(token => token.length >= 2)))

  // 2) 再對每個 token，若混合 script（漢字+拉丁/數字）則按 script 邊界拆分
  const expanded = new Set<string>()
  for (const token of baseTokens) {
    expanded.add(token)

    // 按 script 邊界拆分：漢字連續段 vs 非漢字連續段（拉丁/數字/其他）
    const parts = token.match(/[\p{Script=Han}]+|[^\p{Script=Han}]+/gu) ?? [token]
    for (let i = 0; i < parts.length - 1; i++) {
      const pair = `${parts[i]}${parts[i + 1]}`.trim()
      if (pair.length >= 2) expanded.add(pair)
    }
    for (const part of parts) {
      const trimmed = part.trim()
      if (trimmed.length < 2) continue
      expanded.add(trimmed)

      // 若是漢字連續段，產生 2-gram 滑窗與短詞拆解，支援長句召回
      if (/^[\p{Script=Han}]+$/u.test(trimmed)) {
        for (let i = 0; i < trimmed.length - 1; i++) {
          expanded.add(trimmed.slice(i, i + 2))
        }
        if (trimmed.length <= 3) {
          for (const ch of trimmed) {
            expanded.add(ch)
          }
        }
      }
    }
  }

  if (expanded.size === 0) return null

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

export function weightedReciprocalRankFuse<T extends ChunkIdentified>(
  rankedLists: Array<{ results: T[]; weight?: number }>,
  limit: number,
  k = RRF_K
): Array<T & { relevance_score: number }> {
  const activeLists = rankedLists.filter(list => list.results.length > 0 && (list.weight ?? 1) > 0)
  const merged = new Map<string, { row: T; score: number }>()

  for (const list of activeLists) {
    const weight = list.weight ?? 1
    list.results.forEach((row, index) => {
      const rank = index + 1
      const contribution = weight / (k + rank)
      const existing = merged.get(row.chunk_id)

      if (existing) {
        existing.score += contribution
        existing.row = { ...existing.row, ...row }
      } else {
        merged.set(row.chunk_id, { row, score: contribution })
      }
    })
  }

  const maxPossibleScore = activeLists.reduce((sum, list) => sum + (list.weight ?? 1) / (k + 1), 0)

  return [...merged.values()]
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ row, score }) => ({
      ...row,
      relevance_score: maxPossibleScore > 0 ? score / maxPossibleScore : 0,
    }))
}
