export const prerender = false

import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'
import type { Env } from '@/lib/config/env'
import { requireAdmin } from '@/lib/auth/admin'
import { toIsoDay } from '@/lib/utils/dates'

export const GET: APIRoute = async ({ cookies, url }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response

  const db = (env as unknown as Env).DB
  const days = parseInt(url.searchParams.get('days') || '30')

  // Build CSV from available stats
  const rows: string[] = []
  const today = toIsoDay()
  rows.push('metric,value,date')

  try {
    // Content stats
    const totalPosts = await db.prepare('SELECT COUNT(*) as c FROM posts').first<{ c: number }>()
    rows.push(`total_posts,${totalPosts?.c ?? 0},${today}`)

    // Job stats
    const jobStats = await db.prepare(`
      SELECT status, COUNT(*) as c
      FROM admin_jobs
      WHERE created_at >= datetime('now', '-' || ? || ' days')
      GROUP BY status
    `).bind(days).all<{ status: string; c: number }>()
    for (const row of jobStats.results || []) {
      rows.push(`jobs_${row.status},${row.c},${today}`)
    }

    // RAG queries
    const ragStats = await db.prepare(`
      SELECT COUNT(DISTINCT trace_id) as c
      FROM rag_trace_steps
      WHERE started_at >= datetime('now', '-' || ? || ' days')
    `).bind(days).first<{ c: number }>()
    rows.push(`rag_queries,${ragStats?.c ?? 0},${today}`)

    // Glossary lookups
    const glossaryStats = await db.prepare(`
      SELECT COUNT(*) as c
      FROM glossary_lookup_stats
      WHERE created_at >= datetime('now', '-' || ? || ' days')
    `).bind(days).first<{ c: number }>()
    rows.push(`glossary_lookups,${glossaryStats?.c ?? 0},${today}`)
  } catch {
    // Tables may not exist yet
  }

  return new Response(rows.join('\n'), {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="stats-${today}.csv"`,
    },
  })
}

