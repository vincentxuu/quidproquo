export const prerender = false

import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'
import type { Env } from '@/lib/config/env'
import { requireAdmin } from '@/lib/auth/admin'
import { json } from '@/lib/api/response'
import { ensureAgentFlowEnabled } from '../../_guard'

export const DELETE: APIRoute = async ({ cookies, params }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response
  const disabled = ensureAgentFlowEnabled()
  if (disabled) return disabled

  const { id: flowId, presetId } = params
  if (!flowId || !presetId) return json({ error: 'flow_id and preset_id required' }, 400)

  const db = (env as unknown as Env).DB
  try {
    const result = await db
      .prepare(`DELETE FROM flow_presets WHERE preset_id=? AND flow_id=?`)
      .bind(presetId, flowId)
      .run()

    if (!result.meta.changes) return json({ error: 'not_found' }, 404)
    return json({ deleted: true })
  } catch {
    return json({ error: 'not_found' }, 404)
  }
}
