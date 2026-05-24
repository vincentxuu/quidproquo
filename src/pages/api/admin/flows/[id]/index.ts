export const prerender = false

import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'
import type { Env } from '@/lib/config/env'
import { requireAdmin } from '@/lib/auth/admin'
import { json, badRequest, notFound } from '@/lib/api/response'
import { nowMs } from '@/lib/utils/dates'
import { ensureAgentFlowEnabled } from '../_guard'

export const DELETE: APIRoute = async ({ cookies, params }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response

  const disabled = ensureAgentFlowEnabled()
  if (disabled) return disabled

  const flowId = params.id
  if (!flowId) return badRequest('flow id is required')

  const db = (env as unknown as Env).DB
  const flow = await db
    .prepare(`SELECT flow_id FROM flow_definitions WHERE flow_id = ? LIMIT 1`)
    .bind(flowId)
    .first<{ flow_id: string }>()

  if (!flow) return notFound('flow not found')

  const runCountRow = await db
    .prepare(`SELECT COUNT(*) AS total FROM flow_runs WHERE flow_id = ?`)
    .bind(flowId)
    .first<{ total: number }>()
  const runCount = runCountRow?.total ?? 0

  if (runCount > 0) {
    await db
      .prepare(`UPDATE flow_definitions SET is_enabled = 0, updated_at = ? WHERE flow_id = ?`)
      .bind(nowMs(), flowId)
      .run()
    return json({ archived: true, deleted: false, reason: 'flow has run history' })
  }

  await db.batch([
    db.prepare(`DELETE FROM flow_presets WHERE flow_id = ?`).bind(flowId),
    db.prepare(`DELETE FROM flow_versions WHERE flow_id = ?`).bind(flowId),
    db.prepare(`DELETE FROM flow_definitions WHERE flow_id = ?`).bind(flowId),
  ])

  return json({ archived: false, deleted: true })
}
