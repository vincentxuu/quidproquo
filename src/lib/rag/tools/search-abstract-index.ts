import { env } from 'cloudflare:workers'
import type { SearchResult } from '../state'
import type { Env } from '@/lib/config/env'
import { defineSyscall } from '../../agent-os/tools/define'

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

export const searchAbstractIndexSyscall = defineSyscall<Parameters<typeof searchAbstractIndex>[0], { results: SearchResult[] }>({
  name: 'search.abstract-index',
  description: 'Search the abstract Vectorize index for high-level post summaries.',
  inputSchema: {
    type: 'object',
    required: ['query'],
    properties: {
      query: { type: 'string' },
      limit: { type: 'number', default: 5 },
    },
  },
  outputSchema: {
    type: 'object',
    required: ['results'],
    properties: {
      results: { type: 'array', items: { type: 'object', additionalProperties: true } },
    },
  },
  costModel: { kind: 'token', inputPerKToken: 0, outputPerKToken: 0 },
  async handler(_ctx, input) {
    return { results: await searchAbstractIndex(input) }
  },
})
