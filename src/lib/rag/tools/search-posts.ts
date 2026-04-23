import { tool } from '@langchain/core/tools'
import { z } from 'zod'
import { env } from 'cloudflare:workers'
import type { SearchResult } from '../state'

interface Env { VECTORIZE_INDEX: VectorizeIndex; AI: Ai }

function parseJsonArray(s: string): unknown[] {
  try { return JSON.parse(s) } catch { return [] }
}

export const searchBlogPosts = tool(
  async ({ query, category, lang, limit = 8 }): Promise<SearchResult[]> => {
    const { VECTORIZE_INDEX, AI } = env as unknown as Env

    const embResult = await AI.run('@cf/baai/bge-large-en-v1.5', { text: [query] }) as { data: number[][] }
    const queryVector = embResult.data[0]

    const filter: VectorizeVectorMetadataFilter = { type: { $eq: 'post' } }
    if (category) Object.assign(filter, { category: { $eq: category } })
    if (lang) Object.assign(filter, { lang: { $eq: lang } })

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
        source_url: `https://quidproquo.cc/posts/${meta.slug}`,
        chunk_id: String(meta.chunk_id ?? m.id),
        date: String(meta.date ?? ''),
        relevance_score: m.score ?? 0,
        images: parseJsonArray(String(meta.images ?? '[]')) as string[],
        links: parseJsonArray(String(meta.links ?? '[]')) as { text: string; url: string }[],
        type: 'post',
        slug: String(meta.slug ?? ''),
        title: String(meta.title ?? ''),
      }
    })
  },
  {
    name: 'search_blog_posts',
    description: "Search the blog author's posts using semantic vector search. Use this to find relevant articles the author has written.",
    schema: z.object({
      query: z.string().describe('Search query in natural language'),
      category: z.string().optional().describe('Filter by category: ai, tech, education, product, life'),
      lang: z.string().optional().describe('Filter by language: zh-TW or en'),
      limit: z.number().optional().describe('Max results (default 8)'),
    }),
  }
)
