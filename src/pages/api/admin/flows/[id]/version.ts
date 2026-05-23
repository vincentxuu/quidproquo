export const prerender = false

import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'
import type { Env } from '@/lib/config/env'
import { requireAdmin } from '@/lib/auth/admin'
import { json, badRequest, notFound } from '@/lib/api/response'
import { loadFlow } from '@/lib/agent-flow/dsl/load'
import { tryValidateFlowSchema, detectEdgeCycles } from '@/lib/agent-flow/dsl/validate'
import { nowMs } from '@/lib/utils/dates'
import { ensureAgentFlowEnabled } from '../_guard'
import type { FlowEdge } from '@/lib/agent-flow/dsl/ast'

export const POST: APIRoute = async ({ cookies, request, params }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response

  const disabled = ensureAgentFlowEnabled()
  if (disabled) return disabled

  const flowId = params.id
  if (!flowId) return badRequest('flow id is required')

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return badRequest('invalid JSON body')
  }

  const yamlSource = (body as Record<string, unknown>)?.yaml
  if (typeof yamlSource !== 'string' || !yamlSource.trim()) {
    return badRequest('yaml field is required')
  }

  const db = (env as unknown as Env).DB

  // Verify the flow exists
  const existing = await db
    .prepare(`SELECT flow_id, current_version, display_name FROM flow_definitions WHERE flow_id = ?`)
    .bind(flowId)
    .first<{ flow_id: string; current_version: number; display_name: string }>()

  if (!existing) return notFound('flow not found')

  // Validate the YAML
  const validationErrors: Array<{ path: string; message: string }> = []

  let raw: unknown
  try {
    raw = loadFlow(yamlSource, 'yaml')
  } catch (err) {
    validationErrors.push({ path: '(yaml)', message: (err as Error).message })
    return json({ valid: false, errors: validationErrors }, 422)
  }

  const schemaErrors = tryValidateFlowSchema(raw)
  validationErrors.push(...schemaErrors)

  if (schemaErrors.length === 0) {
    const rawObj = raw as Record<string, unknown>
    const edges = Array.isArray(rawObj.edges)
      ? (rawObj.edges as Array<{ from: string; to: string }>).filter(
          (e) => typeof e?.from === 'string' && typeof e?.to === 'string',
        )
      : []
    const cycleErrors = detectEdgeCycles(edges as FlowEdge[])
    for (const msg of cycleErrors) {
      validationErrors.push({ path: 'edges', message: msg })
    }
  }

  if (validationErrors.length > 0) {
    return json({ valid: false, errors: validationErrors }, 422)
  }

  const rawObj = raw as Record<string, unknown>
  const newVersion = (existing.current_version ?? 0) + 1
  const now = nowMs()
  const compiledJson = JSON.stringify(rawObj)
  const flowName = (typeof rawObj.name === 'string' ? rawObj.name : null) ?? existing.display_name

  await db.batch([
    db
      .prepare(
        `INSERT INTO flow_versions (flow_id, version, definition_yaml, compiled_json, published_at, published_by)
         VALUES (?, ?, ?, ?, ?, ?)`,
      )
      .bind(flowId, newVersion, yamlSource, compiledJson, now, 'admin'),
    db
      .prepare(
        `UPDATE flow_definitions
         SET current_version = ?, definition_yaml = ?, display_name = ?, updated_at = ?
         WHERE flow_id = ?`,
      )
      .bind(newVersion, yamlSource, flowName, now, flowId),
  ])

  return json({ version: newVersion }, 201)
}
