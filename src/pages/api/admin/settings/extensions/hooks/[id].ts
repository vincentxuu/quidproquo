export const prerender = false

import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'
import { requireAdmin } from '@/lib/auth/admin'
import { json, badRequest, notFound } from '@/lib/api/response'

type Env = { DB: D1Database }

export const PUT: APIRoute = async ({ params, request, cookies }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response

  const hookId = params.id
  if (!hookId) return badRequest('Hook id is required')

  const e = env as unknown as Env
  const existing = await e.DB.prepare('SELECT id FROM hook WHERE id = ?').bind(hookId).first()
  if (!existing) return notFound('Hook not found')

  const body = await request.json().catch(() => ({})) as {
    matcher?: string
    handler_ref?: string
    priority?: number
    blocking?: boolean
    timeout_ms?: number
    on_failure?: string
    enabled?: boolean
  }

  const updates: string[] = []
  const values: unknown[] = []

  if (body.matcher !== undefined) { updates.push('matcher = ?'); values.push(body.matcher) }
  if (body.handler_ref !== undefined) { updates.push('handler_ref = ?'); values.push(body.handler_ref) }
  if (body.priority !== undefined) { updates.push('priority = ?'); values.push(body.priority) }
  if (body.blocking !== undefined) { updates.push('blocking = ?'); values.push(body.blocking ? 1 : 0) }
  if (body.timeout_ms !== undefined) { updates.push('timeout_ms = ?'); values.push(body.timeout_ms) }
  if (body.on_failure !== undefined) { updates.push('on_failure = ?'); values.push(body.on_failure) }
  if (body.enabled !== undefined) { updates.push('enabled = ?'); values.push(body.enabled ? 1 : 0) }

  if (updates.length === 0) return badRequest('No fields to update')

  values.push(hookId)
  await e.DB.prepare(`UPDATE hook SET ${updates.join(', ')} WHERE id = ?`).bind(...values).run()

  const updated = await e.DB.prepare('SELECT * FROM hook WHERE id = ?').bind(hookId).first()
  return json({ hook: updated })
}

export const DELETE: APIRoute = async ({ params, cookies }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response

  const hookId = params.id
  if (!hookId) return badRequest('Hook id is required')

  const e = env as unknown as Env
  const result = await e.DB.prepare('DELETE FROM hook WHERE id = ?').bind(hookId).run()

  if (result.meta.changes === 0) return notFound('Hook not found')
  return json({ deleted: true, id: hookId })
}
