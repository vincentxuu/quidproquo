export const prerender = false

import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'
import type { Env } from '@/lib/config/env'
import { requireAdmin } from '@/lib/auth/admin'
import { json } from '@/lib/api/response'

export const GET: APIRoute = async ({ cookies }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response

  const db = (env as unknown as Env).DB

  let totalPosts = 0
  let categories: { name: string; count: number }[] = []
  let tags: string[] = []
  let typeComplete = 100

  try {
    const totalRow = await db.prepare('SELECT COUNT(*) as c FROM posts').first<{ c: number }>()
    totalPosts = totalRow?.c ?? 0

    const catResult = await db.prepare(
      'SELECT category, COUNT(*) as c FROM posts GROUP BY category ORDER BY c DESC'
    ).all<{ category: string; c: number }>()
    categories = (catResult.results || []).map(r => ({ name: r.category, count: r.c }))

    // Tags would need JSON parsing from tags column
    tags = []
    typeComplete = 100 // Placeholder until we track this properly
  } catch {
    // Tables may not exist yet
  }

  return json({ totalPosts, categories, tags, typeComplete })
}


