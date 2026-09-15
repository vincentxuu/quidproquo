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

  const e = env as unknown as Env
  const db = e.DB
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

  if (!e.AGENT_SESSION_DO) {
    return json({ error: 'AGENT_SESSION_DO not configured' }, 500)
  }

  const stub = e.AGENT_SESSION_DO.get(e.AGENT_SESSION_DO.idFromName(id))
  const doRes = await stub.fetch(new Request('https://do/resume', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId: id, message }),
  }))

  if (!doRes.ok) {
    const detail = await doRes.text().catch(() => '')
    return json({ error: detail || `DO returned ${doRes.status}` }, doRes.status)
  }

  return json({ ok: true, id, status: 'running', message })
}
