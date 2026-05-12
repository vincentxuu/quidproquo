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

  let queries = 0
  let avgLatency = 0
  let cacheHitRate = 0

  try {
    // Get RAG usage from rag_trace_steps table
    const traceStats = await db.prepare(`
      SELECT
        COUNT(DISTINCT trace_id) as queries,
        AVG(duration_ms) as avg_duration
      FROM rag_trace_steps
      WHERE started_at >= datetime('now', '-' || ? || ' days')
    `).bind(days).first<{ queries: number; avg_duration: number | null }>()

    queries = traceStats?.queries ?? 0
    avgLatency = traceStats?.avg_duration ? Math.round(traceStats.avg_duration) : 0

    // Cache hit rate would need semantic_cache tracking
    cacheHitRate = 0 // Placeholder
  } catch {
    // Table may not exist yet
  }

  return json({ queries, avgLatency, cacheHitRate })
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
