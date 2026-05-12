export const prerender = false

import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'
import { verifySession } from '../../../../lib/auth/session'

interface Env {
  DB: D1Database
}

interface PostRow {
  slug: string
  title: string
  category: string
  lang: string
  description: string | null
  tldr: string | null
  tags: string
  created_at: string
  updated_at: string
}

export const GET: APIRoute = async ({ cookies }) => {
  if (!await isAdmin(cookies)) return unauthorized()

  const db = (env as unknown as Env).DB
  const { results } = await db
    .prepare(
      `SELECT slug, title, category, lang, description, tldr, tags, created_at, updated_at
       FROM posts
       ORDER BY created_at DESC`
    )
    .all<PostRow>()

  const posts = results.map((row) => ({
    slug: row.slug,
    title: row.title,
    category: row.category,
    lang: row.lang,
    date: row.created_at,
    updatedAt: row.updated_at,
    draft: false,
    type: null,
    tags: parseTags(row.tags),
    hasDescription: Boolean(row.description),
    hasTldr: Boolean(row.tldr),
    href: `/posts/${row.slug}`,
    sourcePath: `src/content/posts/${row.slug}.md`,
  }))

  const categories = [...new Set(posts.map((post) => post.category))].sort()
  const publishedCount = posts.length
  const draftCount = 0
  const missingDescriptionCount = posts.filter((post) => !post.hasDescription).length
  const missingTldrCount = posts.filter((post) => !post.hasTldr).length

  return json({
    posts,
    categories,
    summary: {
      total: posts.length,
      published: publishedCount,
      drafts: draftCount,
      metadataMissing: missingDescriptionCount + missingTldrCount,
    },
  })
}

async function isAdmin(cookies: Parameters<APIRoute>[0]['cookies']): Promise<boolean> {
  const token = cookies.get('session')?.value
  return token ? verifySession(token) : false
}

function parseTags(value: string): string[] {
  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) ? parsed.map(String) : []
  } catch {
    return []
  }
}

function unauthorized(): Response {
  return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } })
}

function json(data: unknown): Response {
  return new Response(JSON.stringify(data), { headers: { 'Content-Type': 'application/json' } })
}
