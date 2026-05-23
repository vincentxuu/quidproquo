export const prerender = false

import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'
import type { Env } from '@/lib/config/env'
import { requireAdmin } from '@/lib/auth/admin'
import { ensureAgentFlowEnabled } from '../_guard'
import { json } from '@/lib/api/response'

export const POST: APIRoute = async ({ cookies, params, request }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response

  const disabled = ensureAgentFlowEnabled()
  if (disabled) return disabled

  const flowId = params.id
  if (!flowId) return json({ error: 'flow_id required' }, 400)

  const db = (env as unknown as Env).DB
  const formData = await request.formData().catch(() => null)
  const rawAction = formData?.get('enabled')
  const rawBody = rawAction ?? (await request.text().catch(() => ''))

  const isEnabled =
    rawAction === '1' || rawAction === 'true' || rawBody === '1' || rawBody === 'true'

  await db
    .prepare(`UPDATE flow_definitions SET is_enabled = ?, updated_at = ? WHERE flow_id = ?`)
    .bind(isEnabled ? 1 : 0, Date.now(), flowId)
    .run()

  const flow = await db
    .prepare(`SELECT flow_id FROM flow_definitions WHERE flow_id = ? LIMIT 1`)
    .bind(flowId)
    .first<{ flow_id: string }>()

  if (!flow) return json({ error: 'flow not found' }, 404)

  return new Response(null, { status: 303, headers: { Location: `/admin/console/flows` } })
}
