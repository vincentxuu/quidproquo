export const prerender = false
import type { APIRoute } from 'astro'
import { requireAdmin } from '@/lib/auth/admin'
import { json, badRequest } from '@/lib/api/response'
import { env } from 'cloudflare:workers'
import type { Env } from '@/lib/config/env'

function computeNextRunFromNow(cron: string, staggerSeconds: number): number | null {
  const now = new Date()
  const parts = cron.trim().split(/\s+/)
  if (parts.length !== 5) return null
  const [minStr, hourStr, , , dowStr] = parts
  if (minStr === '*' && hourStr === '*') return now.getTime() + 3600_000 + staggerSeconds * 1000
  const min = minStr === '*' ? 0 : parseInt(minStr, 10)
  const hour = hourStr === '*' ? now.getUTCHours() : parseInt(hourStr, 10)
  const next = new Date(now)
  next.setUTCHours(hour, min, 0, 0)
  if (dowStr !== '*') {
    const target = parseInt(dowStr, 10)
    let ahead = target - next.getUTCDay()
    if (ahead <= 0) ahead += 7
    next.setUTCDate(next.getUTCDate() + ahead)
  } else if (next.getTime() <= now.getTime()) {
    next.setUTCDate(next.getUTCDate() + 1)
  }
  return next.getTime() + staggerSeconds * 1000
}

export const GET: APIRoute = async ({ cookies }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response
  const e = env as unknown as Env
  const rows = await e.DB.prepare('SELECT * FROM routines ORDER BY created_at DESC').all().catch(() => ({ results: [] as unknown[] }))
  return json({ routines: (rows as unknown as { results: unknown[] }).results ?? [] })
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
  const cron = body.cron ? String(body.cron) : null
  const nextRunAt = cron ? computeNextRunFromNow(cron, stagger) : null
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
