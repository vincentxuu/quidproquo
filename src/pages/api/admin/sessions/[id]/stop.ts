export const prerender = false

import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'
import type { Env } from '@/lib/config/env'
import { requireAdmin } from '@/lib/auth/admin'
import { json, notFound } from '@/lib/api/response'
import { createSessionManager } from '@/lib/agent/session-manager'

export const POST: APIRoute = async ({ cookies, params }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response

  const db = (env as unknown as Env).DB
  const mgr = createSessionManager(db)
  const id = params.id!

  const session = await mgr.get(id)
  if (!session) return notFound('session not found')

  if (!['running', 'pending', 'waiting_approval'].includes(session.status)) {
    return json({ error: `cannot stop session in status: ${session.status}` }, 409)
  }

  await mgr.stop(id)
  return json({ ok: true, id, status: 'cancelled' })
}
