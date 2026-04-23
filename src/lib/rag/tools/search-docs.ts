import { tool } from '@langchain/core/tools'
import { z } from 'zod'
import { env } from 'cloudflare:workers'
import type { SearchResult } from '../state'

interface Env { VECTORIZE_INDEX: VectorizeIndex; AI: Ai }

function parseJsonArray(s: string): unknown[] {
  try { return JSON.parse(s) } catch { return [] }
}

export const searchDocs = tool(
  async ({ query, source_name, limit = 8 }): Promise<SearchResult[]> => {
    const { VECTORIZE_INDEX, AI } = env as unknown as Env

    const embResult = await AI.run('@cf/baai/bge-large-en-v1.5', { text: [query] }) as { data: number[][] }
    const queryVector = embResult.data[0]

    const filter: VectorizeVectorMetadataFilter = { type: { $in: ['doc', 'custom'] } }
    if (source_name) Object.assign(filter, { source_name: { $eq: source_name } })

    const results = await VECTORIZE_INDEX.query(queryVector, {
      topK: limit,
      filter,
      returnMetadata: 'all',
    })

    return results.matches.map(m => {
      const meta = (m.metadata ?? {}) as Record<string, unknown>
      const content = String(meta.sentence_window ?? meta.content ?? '')
      return {
        claim: content.split(/[.。]/)[0] ?? content.slice(0, 100),
        evidence_excerpt: content,
        source_url: String(meta.source_url ?? ''),
        chunk_id: String(meta.chunk_id ?? m.id),
        date: '',
        relevance_score: m.score ?? 0,
        images: parseJsonArray(String(meta.images ?? '[]')) as string[],
        links: parseJsonArray(String(meta.links ?? '[]')) as { text: string; url: string }[],
        type: String(meta.type ?? 'doc') as 'doc' | 'custom',
      }
    })
  },
  {
    name: 'search_docs',
    description: 'Search external technical documentation (Cloudflare D1, Workers, Vectorize, Astro). Use this for technical questions about these platforms.',
    schema: z.object({
      query: z.string().describe('Search query'),
      source_name: z.string().optional().describe('Filter to specific doc source, e.g. "Cloudflare D1"'),
      limit: z.number().optional(),
    }),
  }
)
