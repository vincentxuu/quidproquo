export const prerender = false
import type { APIRoute } from 'astro'
import { requireAdmin } from '@/lib/auth/admin'
import { json, badRequest } from '@/lib/api/response'
import { env } from 'cloudflare:workers'
import type { Env } from '@/lib/config/env'
import { getWaitUntil, startRoutineRun } from '@/lib/agent/routine-run'
import { nextRoutineRunAt, parseCron } from '@/lib/agent/cron-schedule'
import { loadFailureSummaries } from '@/lib/agent/failure-summary'

export const GET: APIRoute = async ({ cookies, params }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response
  const e = env as unknown as Env
  const row = await e.DB.prepare('SELECT * FROM routines WHERE id = ?').bind(params.id).first()
  if (!row) return json({ error: 'not found' }, 404)
  const runs = await e.DB.prepare('SELECT id, status, created_at FROM agent_sessions WHERE routine_id = ? ORDER BY created_at DESC LIMIT 20')
    .bind(params.id)
    .all()
    .catch(() => ({ results: [] as unknown[] }))
  const runList = ((runs as unknown as { results: Array<{ id: string; status: string }> }).results ?? [])
  // Like a CI badge: the warning describes the latest run and clears on the next success.
  let lastFailure = null
  if (row.last_run_status === 'failed' && row.last_run_id) {
    const summary = (await loadFailureSummaries(e.DB, [String(row.last_run_id)])).get(String(row.last_run_id))
    const firstNonFailure = runList.findIndex((r) => r.status !== 'failed')
    lastFailure = summary
      ? { sessionId: String(row.last_run_id), failedAt: Number(row.last_run_at), consecutive: firstNonFailure === -1 ? runList.length : firstNonFailure, ...summary }
      : null
  }
  return json({ routine: row, runs: runList, lastFailure })
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
  if (body.cron !== undefined && body.cron !== null && body.cron !== '' && !parseCron(String(body.cron))) {
    return badRequest('invalid cron expression (5 fields, UTC)')
  }
  if (!fields.length) return badRequest('no fields')
  // A changed cron or a resumed routine starts from the next slot, not a stale one.
  if (body.cron !== undefined || body.enabled) {
    const current = await e.DB.prepare('SELECT cron, stagger_seconds FROM routines WHERE id = ?').bind(params.id)
      .first<{ cron: string | null; stagger_seconds: number }>()
    const cron = body.cron !== undefined ? (body.cron ? String(body.cron) : null) : current?.cron ?? null
    fields.push('next_run_at = ?'); vals.push(cron ? nextRoutineRunAt(cron, current?.stagger_seconds ?? 0) : null)
  }
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

export const POST: APIRoute = async ({ cookies, params, request, locals }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response
  const e = env as unknown as Env
  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>
  if (body.action !== 'run') return badRequest('unknown action')
  const routine = await e.DB.prepare('SELECT * FROM routines WHERE id = ?').bind(params.id).first() as Record<string, unknown> | null
  if (!routine) return json({ error: 'not found' }, 404)

  const { sessionId, run } = await startRoutineRun(e, {
    id: String(params.id),
    instructions: String(routine.instructions ?? ''),
    model: routine.model ? String(routine.model) : null,
    repo: routine.repo ? String(routine.repo) : null,
  }, { trigger: 'manual' })
  getWaitUntil(locals)?.(run)

  return json({ sessionId, routineId: params.id })
}
