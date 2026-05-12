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

  let lookups = 0
  let missingDefinitions = 0
  let topTerms: { term: string; count: number }[] = []

  try {
    const stats = await db.prepare(`
      SELECT COUNT(*) as c FROM glossary_lookup_stats
      WHERE created_at >= datetime('now', '-' || ? || ' days')
    `).bind(days).first<{ c: number }>()
    lookups = stats?.c ?? 0

    const termsResult = await db.prepare(`
      SELECT term, COUNT(*) as c
      FROM glossary_lookup_stats
      WHERE created_at >= datetime('now', '-' || ? || ' days')
      GROUP BY term
      ORDER BY c DESC
      LIMIT 10
    `).bind(days).all<{ term: string; c: number }>()
    topTerms = (termsResult.results || []).map(r => ({ term: r.term, count: r.c }))
  } catch {
    // Table may not exist yet
  }

  return json({ lookups, missingDefinitions, topTerms })
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
