export const prerender = false

import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'
import type { Env } from '@/lib/config/env'
import { requireAdmin } from '@/lib/auth/admin'
import { json, badRequest } from '@/lib/api/response'

const VALID_KEYS = new Set([
  'runner_provider',
  'network_mode',
  'allowed_hosts',
  'denied_hosts',
  'setup_script',
])

export const GET: APIRoute = async ({ cookies }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response

  const db = (env as unknown as Env).DB
  const rows = await db.prepare('SELECT key, value FROM environment_config').all<{ key: string; value: string }>()
  const config: Record<string, string> = {}
  for (const row of rows.results) config[row.key] = row.value

  const vars = await db
    .prepare('SELECT name, created_at, updated_at FROM environment_variables')
    .all<{ name: string; created_at: number; updated_at: number }>()

  return json({
    ok: true,
    config,
    variables: vars.results.map(v => ({ name: v.name, createdAt: v.created_at, updatedAt: v.updated_at })),
  })
}

export const PUT: APIRoute = async ({ cookies, request }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response

  const db = (env as unknown as Env).DB
  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>
  const config = body.config as Record<string, string> | undefined
  if (!config) return badRequest('config is required')

  const now = Date.now()
  const stmt = db.prepare(
    'INSERT INTO environment_config (key, value, updated_at) VALUES (?, ?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at',
  )

  const batch = Object.entries(config)
    .filter(([key]) => VALID_KEYS.has(key))
    .map(([key, value]) => stmt.bind(key, String(value), now))

  if (batch.length > 0) await db.batch(batch)

  return json({ ok: true })
}
