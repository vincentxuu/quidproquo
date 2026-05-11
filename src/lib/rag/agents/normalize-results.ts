import type { GraphState, SearchResult } from '../state'

export function parseMetadataArrays(meta: { images: unknown; links: unknown }): {
  images: string[]
  links: { text: string; url: string }[]
} {
  function tryParse(v: unknown): unknown[] {
    try { return JSON.parse(String(v ?? '[]')) } catch { return [] }
  }
  return {
    images: tryParse(meta.images) as string[],
    links: tryParse(meta.links) as { text: string; url: string }[],
  }
}

export function orderByRelevance(results: SearchResult[]): SearchResult[] {
  return [...results].sort((a, b) => b.relevance_score - a.relevance_score)
}

function tokenize(text: string): string[] {
  return (text.match(/[\p{L}\p{N}][\p{L}\p{N}-]*/gu) ?? []).map(token => token.toLowerCase())
}

export function rerankByQuery(
  results: SearchResult[],
  query: string,
  minKeep: number
): SearchResult[] {
  const queryTokens = new Set(tokenize(query))
  const scored = [...results].map(result => {
    const contentTokens = tokenize(`${result.claim} ${result.evidence_excerpt}`)
    const overlap = contentTokens.filter(token => queryTokens.has(token)).length
    const overlapScore = queryTokens.size === 0 ? 0 : overlap / queryTokens.size
    const score = (result.relevance_score * 0.7) + (overlapScore * 0.3)
    return { result, score }
  })

  const ordered = scored.sort((a, b) => b.score - a.score).map(item => ({
    ...item.result,
    relevance_score: item.score,
  }))

  return ordered.slice(0, Math.max(minKeep, ordered.length))
}

function jaccardSimilarity(a: string, b: string): number {
  const setA = new Set(tokenize(a))
  const setB = new Set(tokenize(b))
  const intersection = [...setA].filter(token => setB.has(token)).length
  const union = new Set([...setA, ...setB]).size
  return union === 0 ? 0 : intersection / union
}

export function applyMmrOrdering(results: SearchResult[], lambda: number): SearchResult[] {
  if (results.length <= 2) return results

  const remaining = [...results]
  const selected: SearchResult[] = [remaining.shift()!]

  while (remaining.length > 0) {
    let bestIndex = 0
    let bestScore = Number.NEGATIVE_INFINITY

    remaining.forEach((candidate, index) => {
      const noveltyPenalty = Math.max(
        ...selected.map(chosen => jaccardSimilarity(candidate.evidence_excerpt, chosen.evidence_excerpt)),
        0
      )
      const mmrScore = (lambda * candidate.relevance_score) - ((1 - lambda) * noveltyPenalty)
      if (mmrScore > bestScore) {
        bestScore = mmrScore
        bestIndex = index
      }
    })

    selected.push(remaining.splice(bestIndex, 1)[0])
  }

  return selected
}

export async function normalizeResultsNode(state: GraphState): Promise<Partial<GraphState>> {
  const query = typeof state.messages[state.messages.length - 1]?.content === 'string'
    ? state.messages[state.messages.length - 1].content
    : ''

  let ordered = orderByRelevance(state.search_results)
  if (state.config.rerankerEnabled) {
    ordered = rerankByQuery(ordered, query, state.config.rerankerMinKeep)
    ordered = applyMmrOrdering(ordered, state.config.mmrLambda)
  }

  const maxScore = ordered[0]?.relevance_score ?? 0

  return {
    search_results: ordered,
    needs_web_search: maxScore < 0.4,
  }
}
