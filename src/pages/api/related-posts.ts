export const prerender = false

import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'
import type { Env } from '@/lib/config/env'
import { EMBED_MODEL } from '@/lib/rag/tools/hybrid-search'
import { buildContextualChunk } from '@/lib/embed/contextual'

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url)
  const slug = url.searchParams.get('slug')?.trim()
  const limit = Math.min(6, Math.max(1, Number(url.searchParams.get('limit') ?? '3')))

  if (!slug) {
    return Response.json({ error: 'missing slug' }, { status: 400 })
  }

  const { DB, VECTORIZE_INDEX, AI } = env as unknown as Env

  const post = await DB.prepare(
    `SELECT p.id, p.slug, p.title, p.category, p.lang, p.created_at,
            pc.content, pc.chunk_index
     FROM posts p
     JOIN post_chunks pc ON pc.post_id = p.id
     WHERE p.slug = ?
     ORDER BY pc.chunk_index ASC
     LIMIT 1`
  ).bind(slug).first<{
    id: string; slug: string; title: string; category: string;
    lang: string; created_at: string; content: string; chunk_index: number
  }>()

  if (!post) {
    return Response.json({ error: 'post not found' }, { status: 404 })
  }

  const contextual = buildContextualChunk(post.content, {
    type: 'post',
    title: post.title,
    category: post.category,
    date: post.created_at.slice(0, 10),
  })

  const embResult = await AI.run(EMBED_MODEL, { text: [contextual] }) as { data: number[][] }
  const queryVector = embResult.data[0]

  const vectorResults = await VECTORIZE_INDEX.query(queryVector, {
    topK: limit * 5,
    returnMetadata: 'all',
  })

  const seen = new Set<string>([slug])
  const candidates: { slug: string; title: string; score: number }[] = []

  for (const match of vectorResults.matches) {
    const meta = (match.metadata ?? {}) as Record<string, unknown>
    if (meta.type !== 'post') continue
    if (meta.lang !== post.lang) continue
    const matchSlug = String(meta.slug ?? '')
    if (!matchSlug || seen.has(matchSlug)) continue
    seen.add(matchSlug)
    candidates.push({
      slug: matchSlug,
      title: String(meta.title ?? ''),
      score: match.score,
    })
    if (candidates.length >= limit) break
  }

  const results = candidates.map(c => ({
    slug: c.slug,
    title: c.title,
    score: c.score,
    url: `/posts/${c.slug}`,
  }))

  return Response.json({ slug, results }, {
    headers: { 'Cache-Control': 'public, max-age=3600, s-maxage=86400' },
  })
}
