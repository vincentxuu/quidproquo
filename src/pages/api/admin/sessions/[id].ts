export const prerender = false

import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'
import type { Env } from '@/lib/config/env'
import { requireAdmin } from '@/lib/auth/admin'
import { json, badRequest, notFound } from '@/lib/api/response'
import { createSessionManager } from '@/lib/agent/session-manager'

export const GET: APIRoute = async ({ cookies, params }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response

  const db = (env as unknown as Env).DB
  const mgr = createSessionManager(db)
  const id = params.id!

  const session = await mgr.get(id)
  if (!session) return notFound('session not found')

  const msgs = await db
    .prepare('SELECT seq, role, content_json, tool_call_id, tool_name FROM agent_messages WHERE session_id = ? ORDER BY seq')
    .bind(id)
    .all<Record<string, unknown>>()

  const evts = await db
    .prepare('SELECT seq, type, payload_json, event_id FROM agent_events WHERE session_id = ? ORDER BY seq')
    .bind(id)
    .all<Record<string, unknown>>()

  return json({ session, messages: msgs.results ?? [], events: evts.results ?? [] })
}

interface PatchBody {
  name?: unknown
  archived?: unknown
  pinned?: unknown
}

export const PATCH: APIRoute = async ({ cookies, params, request }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response

  const db = (env as unknown as Env).DB
  const mgr = createSessionManager(db)
  const id = params.id!

  const session = await mgr.get(id)
  if (!session) return notFound('session not found')

  const body = (await request.json().catch(() => ({}))) as PatchBody
  let changed = false

  if (typeof body.name === 'string') {
    const name = body.name.trim()
    if (!name) return badRequest('name cannot be empty')
    await mgr.rename(id, name)
    changed = true
  }

  if (typeof body.archived === 'boolean') {
    if (body.archived) {
      await mgr.archive(id)
    } else {
      await mgr.unarchive(id)
    }
    changed = true
  }

  if (typeof body.pinned === 'boolean') {
    if (body.pinned) {
      await mgr.pin(id)
    } else {
      await mgr.unpin(id)
    }
    changed = true
  }

  if (!changed) return badRequest('no valid fields to update')

  const updated = await mgr.get(id)
  return json({ ok: true, session: updated })
}

export const DELETE: APIRoute = async ({ cookies, params }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response

  const db = (env as unknown as Env).DB
  const mgr = createSessionManager(db)
  const id = params.id!

  const session = await mgr.get(id)
  if (!session) return notFound('session not found')

  await mgr.delete(id)
  return json({ ok: true, id })
}
