export const prerender = false

import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'
import { requireAdmin } from '@/lib/auth/admin'
import { json, badRequest } from '@/lib/api/response'

type Env = { DB: D1Database }

const VALID_EVENTS = ['PreToolUse', 'PostToolUse', 'SessionStart', 'Stop']
const VALID_HANDLER_TYPES = ['command', 'http', 'inline']
const VALID_ON_FAILURE = ['fail_open', 'fail_closed']

function genId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}

export const GET: APIRoute = async ({ cookies }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response

  const e = env as unknown as Env
  const rows = await e.DB.prepare('SELECT * FROM hook WHERE enabled = 1 ORDER BY event, priority').all()
  return json({ hooks: rows.results ?? [] })
}

export const POST: APIRoute = async ({ request, cookies }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response

  const e = env as unknown as Env
  const body = await request.json().catch(() => ({})) as {
    event?: string
    matcher?: string
    handler_type?: string
    handler_ref?: string
    priority?: number
    blocking?: boolean
    timeout_ms?: number
    on_failure?: string
  }

  if (!body.event || !VALID_EVENTS.includes(body.event)) {
    return badRequest(`event must be one of: ${VALID_EVENTS.join(', ')}`)
  }
  if (!body.handler_type || !VALID_HANDLER_TYPES.includes(body.handler_type)) {
    return badRequest(`handler_type must be one of: ${VALID_HANDLER_TYPES.join(', ')}`)
  }
  if (!body.handler_ref) {
    return badRequest('handler_ref is required')
  }

  const now = Math.floor(Date.now() / 1000)
  const id = genId('hook')

  await e.DB.prepare(`
    INSERT INTO hook (id, event, matcher, handler_type, handler_ref, priority, blocking, timeout_ms, on_failure, enabled, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?)
  `).bind(
    id,
    body.event,
    body.matcher ?? null,
    body.handler_type,
    body.handler_ref,
    body.priority ?? 100,
    body.blocking ? 1 : 0,
    body.timeout_ms ?? 5000,
    VALID_ON_FAILURE.includes(body.on_failure ?? '') ? body.on_failure! : 'fail_closed',
    now,
  ).run()

  return json({ hook: { id, event: body.event, handler_type: body.handler_type, handler_ref: body.handler_ref } }, 201)
}
