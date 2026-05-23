export const prerender = false

import type { APIRoute } from 'astro'
import { requireAdmin } from '@/lib/auth/admin'
import { json, badRequest } from '@/lib/api/response'
import { loadFlow } from '@/lib/agent-flow/dsl/load'
import { tryValidateFlowSchema, detectEdgeCycles } from '@/lib/agent-flow/dsl/validate'
import type { FlowEdge } from '@/lib/agent-flow/dsl/ast'

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

  const errors: Array<{ path: string; message: string }> = []

  // Step 1: parse YAML
  let raw: unknown
  try {
    raw = loadFlow(yamlSource, 'yaml')
  } catch (err) {
    errors.push({ path: '(yaml)', message: (err as Error).message })
    return json({ valid: false, errors })
  }

  // Step 2: validate schema
  const schemaErrors = tryValidateFlowSchema(raw)
  errors.push(...schemaErrors)

  // Step 3: detect edge cycles (only if schema passed edges check)
  if (schemaErrors.length === 0) {
    const rawObj = raw as Record<string, unknown>
    const edges = Array.isArray(rawObj.edges)
      ? (rawObj.edges as Array<{ from: string; to: string }>).filter(
          (e) => typeof e?.from === 'string' && typeof e?.to === 'string',
        )
      : []
    const cycleErrors = detectEdgeCycles(edges as FlowEdge[])
    for (const msg of cycleErrors) {
      errors.push({ path: 'edges', message: msg })
    }
  }

  return json({ valid: errors.length === 0, errors })
}
