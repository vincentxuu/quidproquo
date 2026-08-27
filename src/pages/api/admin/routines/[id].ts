export const prerender = false
import type { APIRoute } from 'astro'
import { requireAdmin } from '@/lib/auth/admin'
import { json, badRequest } from '@/lib/api/response'
import { env } from 'cloudflare:workers'
import type { Env } from '@/lib/config/env'

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
  // POST /api/admin/routines/:id with {action:'run'} — enqueue via AGENT_QUEUE or direct DO
  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>
  if (body.action !== 'run') return badRequest('unknown action')
  const routine = await e.DB.prepare('SELECT * FROM routines WHERE id = ?').bind(params.id).first() as Record<string, unknown> | null
  if (!routine) return json({ error: 'not found' }, 404)
  // create a session via DO
  if (!e.AGENT_SESSION_DO) return badRequest('AGENT_SESSION_DO not configured')
  const sessionId = `sess_${Date.now()}`
  const stub = e.AGENT_SESSION_DO.getByName(sessionId)
  await stub.fetch(new Request(`https://do/run?sessionId=${sessionId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt: String(routine.instructions ?? ''), skill: String((routine as unknown as { name?: string }).name ?? '') }),
  }))
  return json({ sessionId, routineId: params.id })
}
