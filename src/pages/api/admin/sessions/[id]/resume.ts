export const prerender = false

import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'
import type { Env } from '@/lib/config/env'
import { requireAdmin } from '@/lib/auth/admin'
import { json, badRequest, notFound } from '@/lib/api/response'
import { createSessionManager } from '@/lib/agent/session-manager'

interface ResumeBody {
  message?: unknown
}

export const POST: APIRoute = async ({ cookies, params, request }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response

  const db = (env as unknown as Env).DB
  const mgr = createSessionManager(db)
  const id = params.id!

  const session = await mgr.get(id)
  if (!session) return notFound('session not found')

  if (!['done', 'cancelled', 'failed'].includes(session.status)) {
    return json({ error: `cannot resume session in status: ${session.status}` }, 409)
  }

  const body = (await request.json().catch(() => ({}))) as ResumeBody
  const message = typeof body.message === 'string' ? body.message.trim() : ''
  if (!message) return badRequest('message is required')

  const _now = Date.now()
  const nextSeq = await db
    .prepare('SELECT COALESCE(MAX(seq), 0) + 1 AS next FROM agent_messages WHERE session_id = ?')
    .bind(id)
    .first<{ next: number }>()

  await db
    .prepare('INSERT INTO agent_messages (session_id, seq, role, content_json) VALUES (?, ?, ?, ?)')
    .bind(id, nextSeq?.next ?? 1, 'user', JSON.stringify({ text: message }))
    .run()

  await mgr.resume(id, message)

  return json({ ok: true, id, status: 'running', message })
}
