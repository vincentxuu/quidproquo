export const prerender = false
import type { APIRoute } from 'astro'
import { requireAdmin } from '@/lib/auth/admin'
import { json, badRequest } from '@/lib/api/response'
import { env } from 'cloudflare:workers'
import type { Env } from '@/lib/config/env'

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
  await e.DB.prepare(
    'INSERT INTO routines (id, name, instructions, trigger_type, cron, repo, enabled, connectors, model, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
  )
    .bind(
      id,
      name,
      String(body.instructions ?? ''),
      String(body.trigger_type ?? 'schedule'),
      body.cron ? String(body.cron) : null,
      body.repo ? String(body.repo) : null,
      body.enabled === 0 ? 0 : 1,
      body.connectors ? JSON.stringify(body.connectors) : null,
      body.model ? String(body.model) : null,
      now,
      now,
    )
    .run()
  const row = await e.DB.prepare('SELECT * FROM routines WHERE id = ?').bind(id).first()
  return json({ routine: row }, 201)
}
