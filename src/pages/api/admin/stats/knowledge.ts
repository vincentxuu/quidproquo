export const prerender = false

import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'
import { verifySession } from '../../../../lib/auth/session'

interface Env {
  DB: D1Database
  VECTORIZE_INDEX: VectorizeIndex
}

export const GET: APIRoute = async ({ cookies }) => {
  if (!await isAdmin(cookies)) return unauthorized()

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

async function isAdmin(cookies: Parameters<APIRoute>[0]['cookies']): Promise<boolean> {
  const token = cookies.get('session')?.value
  return token ? verifySession(token) : false
}

function unauthorized(): Response {
  return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } })
}

function json(data: unknown): Response {
  return new Response(JSON.stringify(data), { headers: { 'Content-Type': 'application/json' } })
}
