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

export async function normalizeResultsNode(state: GraphState): Promise<Partial<GraphState>> {
  const ordered = orderByRelevance(state.search_results)
  const maxScore = ordered[0]?.relevance_score ?? 0

  return {
    search_results: ordered,
    needs_web_search: maxScore < 0.4,
  }
}
