export const EMBED_MODEL = '@cf/baai/bge-large-en-v1.5'
export const EMBED_BATCH_SIZE = 50
export const RRF_K = 60

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
