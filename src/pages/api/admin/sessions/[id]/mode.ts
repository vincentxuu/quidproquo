export const prerender = false

import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'
import type { Env } from '@/lib/config/env'
import { requireAdmin } from '@/lib/auth/admin'
import { json, badRequest, notFound } from '@/lib/api/response'

const VALID_MODES = new Set(['auto', 'default', 'plan'])

interface ModeBody {
  mode?: string
}

export const PATCH: APIRoute = async ({ cookies, params, request }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response

  const sessionId = params.id
  if (!sessionId) return notFound('session not found')

  const body = (await request.json().catch(() => ({}))) as ModeBody
  if (!body.mode || !VALID_MODES.has(body.mode)) return badRequest('mode must be auto, default, or plan')

  const db = (env as unknown as Env).DB
  const result = await db.prepare('UPDATE agent_sessions SET mode = ? WHERE id = ?').bind(body.mode, sessionId).run()
  if (!result.meta?.changes) return notFound('session not found')

  return json({ ok: true, mode: body.mode })
}
