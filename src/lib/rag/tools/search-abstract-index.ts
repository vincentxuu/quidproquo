import { env } from 'cloudflare:workers'
import type { SearchResult } from '../state'

interface Env { VECTORIZE_ABSTRACT?: VectorizeIndex; AI: Ai }

export async function searchAbstractIndex(args: {
  query: string
  limit?: number
}): Promise<SearchResult[]> {
  const { query, limit = 5 } = args
  const { VECTORIZE_ABSTRACT, AI } = env as unknown as Env
  if (!VECTORIZE_ABSTRACT) return []

  const embResult = await AI.run('@cf/baai/bge-large-en-v1.5', { text: [query] }) as { data: number[][] }
  const queryVector = embResult.data[0]

  const results = await VECTORIZE_ABSTRACT.query(queryVector, {
    topK: limit,
    returnMetadata: 'all',
  })

  return results.matches.map((m) => {
    const meta = (m.metadata ?? {}) as Record<string, unknown>
    const summary = String(meta.summary ?? meta.content ?? meta.abstract ?? '')
    return {
      claim: summary.split(/[.。]/)[0] ?? summary.slice(0, 100),
      evidence_excerpt: summary,
      source_url: `https://quidproquo.cc/posts/${String(meta.slug ?? '')}`,
      chunk_id: String(meta.chunk_id ?? m.id),
      date: String(meta.date ?? ''),
      relevance_score: m.score ?? 0,
      images: [],
      links: [],
      type: 'abstract' as const,
      slug: String(meta.slug ?? ''),
      title: String(meta.title ?? ''),
    }
  })
}
