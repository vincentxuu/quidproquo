export const prerender = false

import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'
import type { Env } from '@/lib/config/env'
import { requireAdmin } from '@/lib/auth/admin'
import { json } from '@/lib/api/response'

export const GET: APIRoute = async ({ cookies }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response

  const e = env as unknown as Env
  let postChunks = 0
  let docChunks = 0
  let vectorizeSize = 0
  let lastEmbed: string | null = null

  try {
    const postCount = await e.DB.prepare('SELECT COUNT(*) as c FROM post_chunks').first<{ c: number }>()
    postChunks = postCount?.c ?? 0

    const docCount = await e.DB.prepare('SELECT COUNT(*) as c FROM doc_chunks').first<{ c: number }>()
    docChunks = docCount?.c ?? 0

    const lastEmbedRow = await e.DB.prepare(
      "SELECT updated_at FROM doc_chunks ORDER BY updated_at DESC LIMIT 1"
    ).first<{ updated_at: string }>()
    lastEmbed = lastEmbedRow?.updated_at ?? null
  } catch {
    // Tables may not exist yet
  }

  try {
    const info = await e.VECTORIZE_INDEX.describe()
    vectorizeSize = info?.vectorsCount ?? 0
  } catch {
    // Vectorize may not be available
  }

  return json({ postChunks, docChunks, vectorizeSize, lastEmbed })
}



