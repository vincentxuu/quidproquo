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

  let successRate = 0
  let avgDuration = 0
  let pending = 0
  let failed = 0

  try {
    // Get job stats from admin_jobs table
    const stats = await db.prepare(`
      SELECT
        COUNT(*) as total,
        SUM(CASE WHEN status = 'succeeded' THEN 1 ELSE 0 END) as succeeded,
        SUM(CASE WHEN status = 'failed' OR status = 'dead_letter' THEN 1 ELSE 0 END) as failed,
        SUM(CASE WHEN status = 'queued' OR status = 'running' THEN 1 ELSE 0 END) as pending,
        AVG(
          CASE WHEN finished_at IS NOT NULL AND started_at IS NOT NULL
          THEN (julianday(finished_at) - julianday(started_at)) * 86400000
          ELSE NULL END
        ) as avg_duration
      FROM admin_jobs
      WHERE created_at >= datetime('now', '-' || ? || ' days')
    `).bind(days).first<{ total: number; succeeded: number; failed: number; pending: number; avg_duration: number | null }>()

    if (stats) {
      successRate = stats.total > 0 ? Math.round((stats.succeeded / stats.total) * 100) : 0
      avgDuration = stats.avg_duration ? Math.round(stats.avg_duration) : 0
      pending = stats.pending ?? 0
      failed = stats.failed ?? 0
    }
  } catch {
    // Table may not exist yet
  }

  return json({ successRate, avgDuration, pending, failed })
}



