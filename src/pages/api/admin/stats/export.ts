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

  // Build CSV from available stats
  const rows: string[] = []
  rows.push('metric,value,date')

  try {
    // Content stats
    const totalPosts = await db.prepare('SELECT COUNT(*) as c FROM posts').first<{ c: number }>()
    rows.push(`total_posts,${totalPosts?.c ?? 0},${new Date().toISOString().split('T')[0]}`)

    // Job stats
    const jobStats = await db.prepare(`
      SELECT status, COUNT(*) as c
      FROM admin_jobs
      WHERE created_at >= datetime('now', '-' || ? || ' days')
      GROUP BY status
    `).bind(days).all<{ status: string; c: number }>()
    for (const row of jobStats.results || []) {
      rows.push(`jobs_${row.status},${row.c},${new Date().toISOString().split('T')[0]}`)
    }

    // RAG queries
    const ragStats = await db.prepare(`
      SELECT COUNT(DISTINCT trace_id) as c
      FROM rag_trace_steps
      WHERE started_at >= datetime('now', '-' || ? || ' days')
    `).bind(days).first<{ c: number }>()
    rows.push(`rag_queries,${ragStats?.c ?? 0},${new Date().toISOString().split('T')[0]}`)

    // Glossary lookups
    const glossaryStats = await db.prepare(`
      SELECT COUNT(*) as c
      FROM glossary_lookup_stats
      WHERE created_at >= datetime('now', '-' || ? || ' days')
    `).bind(days).first<{ c: number }>()
    rows.push(`glossary_lookups,${glossaryStats?.c ?? 0},${new Date().toISOString().split('T')[0]}`)
  } catch {
    // Tables may not exist yet
  }

  return new Response(rows.join('\n'), {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="stats-${new Date().toISOString().split('T')[0]}.csv"`,
    },
  })
}

async function isAdmin(cookies: Parameters<APIRoute>[0]['cookies']): Promise<boolean> {
  const token = cookies.get('session')?.value
  return token ? verifySession(token) : false
}

function unauthorized(): Response {
  return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } })
}
