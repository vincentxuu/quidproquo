export const prerender = false

import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'
import type { Env } from '@/lib/config/env'
import { requireAdmin } from '@/lib/auth/admin'
import { json } from '@/lib/api/response'
import { nowMs } from '@/lib/utils/dates'

export const POST: APIRoute = async ({ cookies, params, request }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response

  const policyId = params.id
  if (!policyId) return json({ error: 'policy_id_required' }, 400)

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return json({ error: 'invalid_json' }, 400)
  }

  const { flowId, scope } = body as { flowId?: unknown; scope?: unknown }

  if (!flowId || typeof flowId !== 'string') {
    return json({ error: 'flowId_required' }, 400)
  }
  if (scope !== 'flow_definition') {
    return json({ error: 'scope_must_be_flow_definition' }, 400)
  }

  const db = (env as unknown as Env).DB

  try {
    const now = nowMs()
    const result = await db
      .prepare(
        `INSERT INTO policy_bindings (policy_id, scope, scope_value, status, created_at, updated_at)
         VALUES (?, 'flow_definition', ?, 'active', ?, ?)`,
      )
      .bind(policyId, flowId, now, now)
      .run()

    const bindingId = result.meta?.last_row_id ?? null
    return json({ bindingId }, 201)
  } catch (err) {
    return json({ error: String(err) }, 500)
  }
}
