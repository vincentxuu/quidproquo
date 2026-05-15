export const prerender = false

import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'
import { verifySession } from '../../../../lib/auth/session'

interface Env {
  DB: D1Database
}

const AGENT_SKILLS_LIBRARY_KEY = 'agent_skills'
const LEGACY_AGENT_SKILLS_LIBRARY_KEY = 'deep_research_agent_skills'

interface AgentSkillsPayload {
  raw?: unknown
}

export const GET: APIRoute = async ({ cookies }) => {
  if (!await isAdmin(cookies)) return unauthorized()

  const db = (env as unknown as Env).DB
  await ensureAdminSettingsTable(db)

  const row = await db.prepare(`
    SELECT key, value, updated_at
    FROM admin_settings
    WHERE key IN (?, ?)
    ORDER BY CASE key WHEN ? THEN 0 ELSE 1 END
    LIMIT 1
  `)
    .bind(AGENT_SKILLS_LIBRARY_KEY, LEGACY_AGENT_SKILLS_LIBRARY_KEY, AGENT_SKILLS_LIBRARY_KEY)
    .first<{ key: string; value: string; updated_at: string }>()

  const raw = typeof row?.value === 'string' ? row.value : ''
  return json({
    ok: true,
    key: row?.key ?? AGENT_SKILLS_LIBRARY_KEY,
    raw,
    updatedAt: row?.updated_at ?? null,
  })
}

export const POST: APIRoute = async ({ cookies, request }) => {
  if (!await isAdmin(cookies)) return unauthorized()

  const db = (env as unknown as Env).DB
  await ensureAdminSettingsTable(db)

  const body = await request.json().catch(() => ({})) as AgentSkillsPayload
  const raw = typeof body.raw === 'string' ? body.raw.trim() : ''

  await db.prepare(`
    INSERT INTO admin_settings (key, value, updated_at)
    VALUES (?, ?, datetime('now'))
    ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at
  `).bind(AGENT_SKILLS_LIBRARY_KEY, raw).run()

  return json({
    ok: true,
    key: AGENT_SKILLS_LIBRARY_KEY,
    raw,
    updatedAt: new Date().toISOString(),
  })
}

async function ensureAdminSettingsTable(db: D1Database): Promise<void> {
  await db.prepare(`
    CREATE TABLE IF NOT EXISTS admin_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at TEXT DEFAULT (datetime('now'))
    )
  `).run()
}

async function isAdmin(cookies: Parameters<APIRoute>[0]['cookies']): Promise<boolean> {
  const token = cookies.get('session')?.value
  return token ? await verifySession(token) : false
}

function unauthorized(): Response {
  return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } })
}

function json(data: unknown): Response {
  return new Response(JSON.stringify(data), { headers: { 'Content-Type': 'application/json' } })
}
