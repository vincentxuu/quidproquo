export const prerender = false

import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'
import type { Env } from '@/lib/config/env'
import { requireAdmin } from '@/lib/auth/admin'
import { json, badRequest } from '@/lib/api/response'
import { loadFlow } from '@/lib/agent-flow/dsl/load'
import { tryValidateFlowSchema, detectEdgeCycles } from '@/lib/agent-flow/dsl/validate'
import { nowMs } from '@/lib/utils/dates'
import type { FlowEdge } from '@/lib/agent-flow/dsl/ast'

interface FlowDefinitionRow {
  id: string
  name: string
  version: number
  description: string | null
}

export const GET: APIRoute = async ({ cookies }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response

  const db = (env as unknown as Env).DB

  try {
    const result = await db
      .prepare(
        `SELECT flow_id AS id, display_name AS name, current_version AS version, description
         FROM flow_definitions
         ORDER BY display_name ASC`,
      )
      .all<FlowDefinitionRow>()

    const flows = (result.results ?? []).map((row) => ({
      id: row.id,
      name: row.name || row.id,
      version: row.version ?? 1,
      description: row.description ?? '',
    }))

    return json({ flows, schedules: [] })
  } catch {
    // Table may not exist yet — return empty list gracefully
    return json({ flows: [], schedules: [] })
  }
}

export const POST: APIRoute = async ({ cookies, request }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response

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

  // Validate
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
  const flowId = typeof rawObj.id === 'string' ? rawObj.id : ''
  if (!flowId) return badRequest('YAML must include an id field')

  const flowName = typeof rawObj.name === 'string' ? rawObj.name : flowId
  const flowDesc = typeof rawObj.description === 'string' ? rawObj.description : null
  const version = typeof rawObj.version === 'number' ? rawObj.version : 1
  const compiledJson = JSON.stringify(rawObj)
  const now = nowMs()

  try {
    await db.batch([
      db
        .prepare(
          `INSERT INTO flow_definitions (flow_id, display_name, description, current_version, definition_yaml, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
        )
        .bind(flowId, flowName, flowDesc, version, yamlSource, now, now),
      db
        .prepare(
          `INSERT INTO flow_versions (flow_id, version, definition_yaml, compiled_json, published_at, published_by)
           VALUES (?, ?, ?, ?, ?, ?)`,
        )
        .bind(flowId, version, yamlSource, compiledJson, now, 'admin'),
    ])
  } catch (err) {
    const msg = (err as Error).message ?? ''
    if (msg.includes('UNIQUE') || msg.includes('unique')) {
      return json({ error: `Flow with id "${flowId}" already exists` }, 409)
    }
    return json({ error: 'Failed to create flow' }, 500)
  }

  return json({ flowId }, 201)
}
