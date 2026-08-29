export const prerender = false

import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'
import type { Env } from '@/lib/config/env'
import { requireAdmin } from '@/lib/auth/admin'
import { json } from '@/lib/api/response'

export const GET: APIRoute = async ({ cookies, params }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response

  const flowRunId = Number(params.flowRunId)
  if (!flowRunId) return json({ error: 'flow_run_id_required' }, 400)

  const db = (env as unknown as Env).DB
  const binding = await db.prepare(
    `SELECT pb.*, pd.policy_key, pd.version, pd.label
     FROM policy_bindings pb
     JOIN policy_definitions pd ON pd.policy_id = pb.policy_id
     WHERE pb.flow_run_id=? AND pb.scope='run'
     ORDER BY pb.binding_id DESC LIMIT 1`
  ).bind(flowRunId).first()

  if (!binding) return json({ effectivePolicy: null, sourceChain: [] })

  const row = binding as Record<string, unknown>
  const frozenEffective = row.frozen_effective_json ? JSON.parse(row.frozen_effective_json as string) : null

  return json({
    effectivePolicy: frozenEffective,
    sourceChain: [{ scope: 'run', policyKey: row.policy_key, version: row.version }],
  })
}
