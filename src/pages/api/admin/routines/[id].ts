export const prerender = false
import type { APIRoute } from 'astro'
import { requireAdmin } from '@/lib/auth/admin'
import { json, badRequest } from '@/lib/api/response'
import { env } from 'cloudflare:workers'
import type { Env } from '@/lib/config/env'
import { createSessionManager } from '@/lib/agent/session-manager'

export const GET: APIRoute = async ({ cookies, params }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response
  const e = env as unknown as Env
  const row = await e.DB.prepare('SELECT * FROM routines WHERE id = ?').bind(params.id).first()
  if (!row) return json({ error: 'not found' }, 404)
  const runs = await e.DB.prepare('SELECT id, status, created_at FROM agent_sessions WHERE agent_id = ? ORDER BY created_at DESC LIMIT 20')
    .bind(params.id)
    .all()
    .catch(() => ({ results: [] as unknown[] }))
  return json({ routine: row, runs: (runs as unknown as { results: unknown[] }).results ?? [] })
}

export const PUT: APIRoute = async ({ cookies, params, request }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response
  const e = env as unknown as Env
  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>
  const fields: string[] = []
  const vals: unknown[] = []
  for (const k of ['name', 'instructions', 'trigger_type', 'cron', 'repo', 'model']) {
    if (body[k] !== undefined) { fields.push(`${k} = ?`); vals.push(String(body[k])) }
  }
  if (body.enabled !== undefined) { fields.push('enabled = ?'); vals.push(body.enabled ? 1 : 0) }
  if (body.connectors !== undefined) { fields.push('connectors = ?'); vals.push(JSON.stringify(body.connectors)) }
  if (body.notification_enabled !== undefined) { fields.push('notification_enabled = ?'); vals.push(body.notification_enabled ? 1 : 0) }
  if (body.notification_channels !== undefined) { fields.push('notification_channels = ?'); vals.push(JSON.stringify(body.notification_channels)) }
  if (body.behavior_auto_fix_pr !== undefined) { fields.push('behavior_auto_fix_pr = ?'); vals.push(body.behavior_auto_fix_pr ? 1 : 0) }
  if (body.behavior_auto_create_pr !== undefined) { fields.push('behavior_auto_create_pr = ?'); vals.push(body.behavior_auto_create_pr ? 1 : 0) }
  if (!fields.length) return badRequest('no fields')
  fields.push('updated_at = ?'); vals.push(Date.now()); vals.push(params.id)
  await e.DB.prepare(`UPDATE routines SET ${fields.join(', ')} WHERE id = ?`).bind(...(vals as unknown[])).run()
  const row = await e.DB.prepare('SELECT * FROM routines WHERE id = ?').bind(params.id).first()
  return json({ routine: row })
}

export const DELETE: APIRoute = async ({ cookies, params }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response
  const e = env as unknown as Env
  await e.DB.prepare('DELETE FROM routines WHERE id = ?').bind(params.id).run()
  return json({ ok: true })
}

export const POST: APIRoute = async ({ cookies, params, request }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response
  const e = env as unknown as Env
  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>
  if (body.action !== 'run') return badRequest('unknown action')
  const routine = await e.DB.prepare('SELECT * FROM routines WHERE id = ?').bind(params.id).first() as Record<string, unknown> | null
  if (!routine) return json({ error: 'not found' }, 404)

  const sessions = createSessionManager(e.DB)
  const session = await sessions.create({
    instruction: String(routine.instructions ?? ''),
    model: routine.model ? String(routine.model) : undefined,
    repo: routine.repo ? String(routine.repo) : undefined,
    trigger: 'manual',
    routineId: String(params.id),
  })

  await e.DB.prepare(
    'UPDATE routines SET last_run_id = ?, last_run_at = ?, last_run_status = ?, updated_at = ? WHERE id = ?',
  ).bind(session.id, Date.now(), 'running', Date.now(), params.id).run()

  return json({ sessionId: session.id, routineId: params.id })
}
