export const prerender = false

import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'
import type { Env } from '@/lib/config/env'
import { requireAdmin } from '@/lib/auth/admin'
import { json, badRequest, notFound } from '@/lib/api/response'
import { resolveWaitingApproval, rejectWaitingApproval } from '@/lib/agent/approval-queue'
import { buildControlResponseEvent } from '@/lib/agent/control-protocol'
import { fromSessionEvent } from '@/lib/agent/events'

interface ApproveBody {
  approval_id?: string
  behavior?: 'allow' | 'deny' | 'accept' | 'accept_auto' | 'reject'
  updatedInput?: unknown
}

export const POST: APIRoute = async ({ cookies, params, request }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response

  const sessionId = params.id
  if (!sessionId) return notFound('session not found')

  const body = (await request.json().catch(() => ({}))) as ApproveBody
  const { approval_id, behavior, updatedInput } = body
  if (!approval_id || !behavior) return badRequest('approval_id and behavior required')

  const e = env as unknown as Env
  const db = e.DB

  const row = await db
    .prepare('SELECT approval_id, status, subtype FROM agent_approval_requests WHERE approval_id = ?')
    .bind(approval_id)
    .first<{ approval_id: string; status: string; subtype: string | null }>()

  if (!row) return notFound('approval not found')
  if (row.status !== 'pending') return json({ error: 'approval already resolved' }, 409)

  const isAllow = behavior === 'allow' || behavior === 'accept' || behavior === 'accept_auto'

  await db
    .prepare(
      'UPDATE agent_approval_requests SET status = ?, resolved_by = ?, resolved_at = ?, response_behavior = ?, updated_input_json = ? WHERE approval_id = ?',
    )
    .bind(
      isAllow ? 'approved' : 'rejected',
      'admin',
      Date.now(),
      behavior,
      updatedInput ? JSON.stringify(updatedInput) : null,
      approval_id,
    )
    .run()

  const responseEvent = buildControlResponseEvent(
    approval_id,
    isAllow ? 'allow' : 'deny',
    updatedInput,
  )

  const seqRow = await db
    .prepare('SELECT COALESCE(MAX(seq), -1) + 1 AS n FROM agent_events WHERE session_id = ?')
    .bind(sessionId)
    .first<{ n: number }>()
  const seq = seqRow?.n ?? 0
  const eventRow = fromSessionEvent(sessionId, seq, responseEvent)

  const result = await db
    .prepare(
      'INSERT INTO agent_events (session_id, seq, type, payload_json, created_at, event_id) VALUES (?, ?, ?, ?, ?, NULL)',
    )
    .bind(eventRow.session_id, eventRow.seq, eventRow.type, eventRow.payload_json, eventRow.created_at)
    .run()

  const eventId = result.meta?.last_row_id
  if (eventId) {
    await db.prepare('UPDATE agent_events SET event_id = ? WHERE session_id = ? AND seq = ?').bind(eventId, sessionId, seq).run()
    if (e.KV) await e.KV.put(`session:${sessionId}:last_event`, String(eventId))
  }

  if (isAllow) {
    resolveWaitingApproval(approval_id)
  } else {
    rejectWaitingApproval(approval_id)
  }

  if (behavior === 'accept_auto') {
    await db.prepare('UPDATE agent_sessions SET mode = ? WHERE id = ?').bind('auto', sessionId).run()
  }

  return json({ ok: true, behavior })
}
