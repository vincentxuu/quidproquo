export const prerender = false

import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'
import type { Env } from '@/lib/config/env'
import { requireAdmin } from '@/lib/auth/admin'
import { json, notFound } from '@/lib/api/response'
import { createSessionManager } from '@/lib/agent/session-manager'

interface VcsPayload {
  branch?: string
  commitSha?: string
  diffStat?: string
  files?: Array<{ name: string; additions?: number; deletions?: number }>
  summary?: string
}

export const GET: APIRoute = async ({ cookies, params }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response

  const db = (env as unknown as Env).DB
  const mgr = createSessionManager(db)
  const id = params.id!

  const session = await mgr.get(id)
  if (!session) return notFound('session not found')

  const rows = await db.prepare(
    `SELECT payload_json FROM agent_events
     WHERE session_id = ? AND type = 'vcs_state_changed'
     ORDER BY seq DESC LIMIT 1`
  ).bind(id).all<{ payload_json: string }>()

  const row = rows.results?.[0]
  if (!row) {
    return json({
      ok: true,
      available: false,
      reason: session.repo ? 'No VCS changes recorded yet' : 'No repo attached to this session',
    })
  }

  const payload: VcsPayload = JSON.parse(row.payload_json)
  return json({
    ok: true,
    available: true,
    branch: payload.branch ?? null,
    commitSha: payload.commitSha ?? null,
    summary: payload.diffStat ?? payload.summary ?? '',
    files: payload.files ?? [],
    repo: session.repo,
  })
}
