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

  const pendingApprovals = await db
    .prepare(
      `SELECT a.approval_id, a.run_id, a.reason, a.context_json, a.created_at,
              a.subtype, a.display_name, a.input_json, a.risk_score
       FROM agent_approval_requests a
       WHERE a.status = 'pending'
       ORDER BY a.created_at DESC
       LIMIT 20`,
    )
    .all()

  const failedSessions = await db
    .prepare(
      `SELECT id, name, summary_detail, finished_at
       FROM agent_sessions
       WHERE status = 'failed' AND archived = 0
       ORDER BY finished_at DESC
       LIMIT 10`,
    )
    .all()

  const needsActionSessions = await db
    .prepare(
      `SELECT id, name, summary_detail, summary_category
       FROM agent_sessions
       WHERE needs_action = 1 AND status NOT IN ('failed', 'cancelled') AND archived = 0
       ORDER BY created_at DESC
       LIMIT 10`,
    )
    .all()

  const pausedSessions = await db
    .prepare(
      `SELECT id, name, summary_detail
       FROM agent_sessions
       WHERE status = 'paused' AND archived = 0
       ORDER BY created_at DESC
       LIMIT 10`,
    )
    .all()

  return json({
    ok: true,
    pendingApprovals: pendingApprovals.results ?? [],
    failedSessions: failedSessions.results ?? [],
    needsActionSessions: needsActionSessions.results ?? [],
    pausedSessions: pausedSessions.results ?? [],
    totalItems:
      (pendingApprovals.results?.length ?? 0) +
      (failedSessions.results?.length ?? 0) +
      (needsActionSessions.results?.length ?? 0) +
      (pausedSessions.results?.length ?? 0),
  })
}
