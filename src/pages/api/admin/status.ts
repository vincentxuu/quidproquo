export const prerender = false

import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'
import type { Env } from '@/lib/config/env'
import { requireAdmin } from '@/lib/auth/admin'
import { json } from '@/lib/api/response'

interface StatusItem {
  name: string
  ok: boolean
  detail?: string
}

export const GET: APIRoute = async ({ cookies }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response

  const e = env as unknown as Env
  const statuses: StatusItem[] = []

  // Check D1
  try {
    await e.DB.prepare('SELECT 1').first()
    statuses.push({ name: 'D1 Database', ok: true })
  } catch {
    statuses.push({ name: 'D1 Database', ok: false, detail: 'Connection failed' })
  }

  // Check KV namespaces
  try {
    await e.SESSION.get('test')
    statuses.push({ name: 'Session KV', ok: true })
  } catch {
    statuses.push({ name: 'Session KV', ok: false })
  }

  try {
    await e.RATE.get('test')
    statuses.push({ name: 'Rate Limit KV', ok: true })
  } catch {
    statuses.push({ name: 'Rate Limit KV', ok: false })
  }

  // Check Vectorize
  try {
    await e.VECTORIZE_INDEX.describe()
    statuses.push({ name: 'Vectorize Index', ok: true })
  } catch {
    statuses.push({ name: 'Vectorize Index', ok: false })
  }

  // Check AI binding
  try {
    const ai = (env as unknown as { AI: unknown }).AI
    if (ai) {
      statuses.push({ name: 'Workers AI', ok: true })
    } else {
      statuses.push({ name: 'Workers AI', ok: false, detail: 'Not bound' })
    }
  } catch {
    statuses.push({ name: 'Workers AI', ok: false })
  }

  // Get index stats
  let index = { postChunks: 0, docChunks: 0, lastEmbed: null as string | null }
  try {
    const postCount = await e.DB.prepare('SELECT COUNT(*) as c FROM post_chunks').first<{ c: number }>()
    const docCount = await e.DB.prepare('SELECT COUNT(*) as c FROM doc_chunks').first<{ c: number }>()
    const lastEmbedRow = await e.DB.prepare(
      `SELECT updated_at FROM doc_chunks ORDER BY updated_at DESC LIMIT 1`
    ).first<{ updated_at: string }>()
    index = {
      postChunks: postCount?.c ?? 0,
      docChunks: docCount?.c ?? 0,
      lastEmbed: lastEmbedRow?.updated_at ?? null,
    }
  } catch {
    // Tables may not exist yet
  }

  // Get content stats
  let content = { total: 0, drafts: 0, missingType: 0 }
  try {
    const totalPosts = await e.DB.prepare('SELECT COUNT(*) as c FROM posts').first<{ c: number }>()
    const draftPosts = await e.DB.prepare(
      "SELECT COUNT(*) as c FROM posts WHERE json_extract(tags, '$') LIKE '%draft%'"
    ).first<{ c: number }>()
    content = {
      total: totalPosts?.c ?? 0,
      drafts: draftPosts?.c ?? 0,
      missingType: 0, // Would need to check frontmatter
    }
  } catch {
    // Table may not exist yet
  }

  return json({ statuses, index, content })
}



