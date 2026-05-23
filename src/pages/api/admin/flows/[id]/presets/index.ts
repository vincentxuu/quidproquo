export const prerender = false

import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'
import type { Env } from '@/lib/config/env'
import { requireAdmin } from '@/lib/auth/admin'
import { json } from '@/lib/api/response'
import { ensureAgentFlowEnabled } from '../../_guard'
import { validatePresetOverrides } from '@/lib/agent-flow/runtime/preset-validator'
import type { FlowPresetOverrides } from '@/lib/agent-flow/dsl/ast'
import { nowMs } from '@/lib/utils/dates'

interface FlowPresetRow {
  preset_id: string
  flow_id: string
  display_name: string
  overrides_json: string | null
  created_at: number
  updated_at: number
}

export const GET: APIRoute = async ({ cookies, params }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response
  const disabled = ensureAgentFlowEnabled()
  if (disabled) return disabled

  const flowId = params.id
  if (!flowId) return json({ error: 'flow_id_required' }, 400)

  const db = (env as unknown as Env).DB
  try {
    const result = await db
      .prepare(
        `SELECT preset_id, flow_id, display_name, overrides_json, created_at, updated_at
         FROM flow_presets WHERE flow_id=? ORDER BY display_name ASC`,
      )
      .bind(flowId)
      .all<FlowPresetRow>()

    const presets = (result.results ?? []).map((row) => ({
      presetId: row.preset_id,
      flowId: row.flow_id,
      name: row.display_name || row.preset_id,
      overrides: row.overrides_json ? JSON.parse(row.overrides_json) : {},
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }))
    return json({ presets })
  } catch {
    return json({ presets: [] })
  }
}

export const POST: APIRoute = async ({ cookies, params, request }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response
  const disabled = ensureAgentFlowEnabled()
  if (disabled) return disabled

  const flowId = params.id
  if (!flowId) return json({ error: 'flow_id_required' }, 400)

  let body: Record<string, unknown> = {}
  try {
    body = (await request.json()) as Record<string, unknown>
  } catch {
    return json({ error: 'invalid_json' }, 400)
  }

  const { presetId, name, overrides } = body
  if (!presetId || !name || !overrides) {
    return json({ error: 'presetId, name, and overrides required' }, 400)
  }

  try {
    validatePresetOverrides(
      overrides as FlowPresetOverrides,
      {} as Parameters<typeof validatePresetOverrides>[1],
    )
  } catch (err) {
    return json({ error: (err as Error).message }, 422)
  }

  const db = (env as unknown as Env).DB
  const now = nowMs()
  try {
    await db
      .prepare(
        `INSERT INTO flow_presets (preset_id, flow_id, display_name, overrides_json, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?)
         ON CONFLICT(preset_id) DO UPDATE SET
           display_name=excluded.display_name,
           overrides_json=excluded.overrides_json,
           updated_at=excluded.updated_at`,
      )
      .bind(String(presetId), flowId, String(name), JSON.stringify(overrides), now, now)
      .run()
  } catch (err) {
    return json({ error: (err as Error).message }, 500)
  }

  return json({ presetId }, 201)
}
