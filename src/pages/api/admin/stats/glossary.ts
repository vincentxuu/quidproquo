export const prerender = false

import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'
import type { Env } from '@/lib/config/env'
import { requireAdmin } from '@/lib/auth/admin'
import { json } from '@/lib/api/response'

export const GET: APIRoute = async ({ cookies, url }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response

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



