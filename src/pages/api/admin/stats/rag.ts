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



