export const prerender = false

import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'
import { verifySession } from '../../../../lib/auth/session'

interface Env {
  DB: D1Database
}

export const GET: APIRoute = async ({ cookies, url }) => {
  if (!await isAdmin(cookies)) return unauthorized()

  const db = (env as unknown as Env).DB
  const days = parseInt(url.searchParams.get('days') || '30')

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
