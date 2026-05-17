export const prerender = false

import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'
import type { Env } from '@/lib/config/env'
import { requireAdmin } from '@/lib/auth/admin'
import { json } from '@/lib/api/response'
import { nowIso } from '@/lib/utils/dates'
import { AGENT_SKILLS_LIBRARY_KEY, LEGACY_AGENT_SKILLS_LIBRARY_KEY } from '@/lib/config/settings-keys'
import { getSettingRows, setSetting } from '@/lib/db/settings-store'

interface AgentSkillsPayload {
  raw?: unknown
}

export const GET: APIRoute = async ({ cookies }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response

  const db = (env as unknown as Env).DB
  const rows = await getSettingRows(db, [AGENT_SKILLS_LIBRARY_KEY, LEGACY_AGENT_SKILLS_LIBRARY_KEY])
  const row = rows.find((item) => item.key === AGENT_SKILLS_LIBRARY_KEY) ?? rows.find((item) => item.key === LEGACY_AGENT_SKILLS_LIBRARY_KEY)

  const raw = typeof row?.value === 'string' ? row.value : ''
  return json({
    ok: true,
    key: row?.key ?? AGENT_SKILLS_LIBRARY_KEY,
    raw,
    updatedAt: row?.updated_at ?? null,
  })
}

export const POST: APIRoute = async ({ cookies, request }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response

  const db = (env as unknown as Env).DB

  const body = await request.json().catch(() => ({})) as AgentSkillsPayload
  const raw = typeof body.raw === 'string' ? body.raw.trim() : ''

  await setSetting(db, AGENT_SKILLS_LIBRARY_KEY, raw)

  return json({
    ok: true,
    key: AGENT_SKILLS_LIBRARY_KEY,
    raw,
    updatedAt: nowIso(),
  })
}
