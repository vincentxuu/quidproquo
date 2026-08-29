import { env } from 'cloudflare:workers'
import type { GraphState } from '../state'
import type { Env } from '@/lib/config/env'
import { embedQueries } from '../embedding'
import { shouldExposeRetrievedLinks } from '../presentation'

export async function relatedPostsNode(state: GraphState): Promise<Partial<GraphState>> {
  if (!shouldExposeRetrievedLinks(state)) {
    return { related_posts: [] }
  }

  const { VECTORIZE_INDEX, AI, DB } = env as unknown as Env
  const lastMessage = state.messages[state.messages.length - 1]
  const query = typeof lastMessage.content === 'string' ? lastMessage.content : ''

  const usedSlugs = new Set(state.search_results.map(r => r.slug).filter(Boolean))

  const [queryVector] = await embedQueries(AI, [query])
  const results = await VECTORIZE_INDEX.query(queryVector, {
    topK: 6,
    filter: { type: { $eq: 'post' } },
    returnMetadata: 'all',
  })

  const candidates = results.matches
    .filter(m => {
      const slug = String((m.metadata as Record<string, unknown>)?.slug ?? '')
      return !usedSlugs.has(slug)
    })
    .slice(0, 3)

  const related = await Promise.all(candidates.map(async m => {
    const meta = (m.metadata ?? {}) as Record<string, unknown>
    const slug = String(meta.slug ?? '')
    const row = await DB.prepare('SELECT description FROM posts WHERE slug = ?')
      .bind(slug).first<{ description: string }>().catch(() => null)
    return {
      title: String(meta.title ?? 'Untitled'),
      slug,
      description: row?.description ?? '',
    }
  }))

  return { related_posts: related }
}
