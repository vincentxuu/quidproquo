export const prerender = false
import type { APIRoute } from 'astro'
import { requireAdmin } from '@/lib/auth/admin'
import { json, badRequest } from '@/lib/api/response'
import { env } from 'cloudflare:workers'
import type { Env } from '@/lib/config/env'
import { nextRoutineRunAt, parseCron } from '@/lib/agent/cron-schedule'
import { loadFailureSummaries } from '@/lib/agent/failure-summary'

export const GET: APIRoute = async ({ cookies }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response
  const e = env as unknown as Env
  const rows = await e.DB.prepare('SELECT * FROM routines ORDER BY created_at DESC').all<Record<string, unknown>>()
    .catch(() => ({ results: [] as Record<string, unknown>[] }))
  const routines = rows.results ?? []
  const failedRunIds = routines.filter((r) => r.last_run_status === 'failed' && r.last_run_id).map((r) => String(r.last_run_id))
  const failures = await loadFailureSummaries(e.DB, failedRunIds)
  return json({
    routines: routines.map((r) => {
      const failure = r.last_run_status === 'failed' ? failures.get(String(r.last_run_id)) : undefined
      return failure ? { ...r, last_failure: failure } : r
    }),
  })
}

export const POST: APIRoute = async ({ cookies, request }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response
  const e = env as unknown as Env
  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>
  const name = String(body.name ?? '').trim()
  if (!name) return badRequest('name required')
  const id = String(body.id ?? `rt_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`)
  const now = Date.now()
  const stagger = Math.floor(Math.random() * 300)
  const cron = body.cron ? String(body.cron).trim() : null
  if (cron && !parseCron(cron)) return badRequest('invalid cron expression (5 fields, UTC)')
  const nextRunAt = cron ? nextRoutineRunAt(cron, stagger) : null
  await e.DB.prepare(
    `INSERT INTO routines (id, name, instructions, trigger_type, cron, repo, enabled, connectors, model,
     stagger_seconds, next_run_at, notification_enabled, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  )
    .bind(
      id,
      name,
      String(body.instructions ?? ''),
      String(body.trigger_type ?? 'schedule'),
      cron,
      body.repo ? String(body.repo) : null,
      body.enabled === 0 ? 0 : 1,
      body.connectors ? JSON.stringify(body.connectors) : null,
      body.model ? String(body.model) : null,
      stagger,
      nextRunAt,
      body.notification_enabled ? 1 : 0,
      now,
      now,
    )
    .run()
  const row = await e.DB.prepare('SELECT * FROM routines WHERE id = ?').bind(id).first()
  return json({ routine: row }, 201)
}
