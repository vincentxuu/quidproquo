export const prerender = false

import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'
import type { Env } from '@/lib/config/env'
import { requireAdmin } from '@/lib/auth/admin'
import { json } from '@/lib/api/response'
import { ensureAgentFlowEnabled } from '../_guard'
import { nowMs } from '@/lib/utils/dates'
import { getTableColumns } from '@/lib/admin-console/schema'

export const POST: APIRoute = async ({ cookies, params, request }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response

  const disabled = ensureAgentFlowEnabled()
  if (disabled) return disabled

  const flowId = params.id
  if (!flowId) return json({ error: 'flow_id_required' }, 400)

  const db = (env as unknown as Env).DB

  // Verify flow exists
  const flow = await db
    .prepare(`SELECT flow_id FROM flow_definitions WHERE flow_id=? LIMIT 1`)
    .bind(flowId)
    .first<{ flow_id: string }>()
  if (!flow) return json({ error: 'not_found' }, 404)

  let body: Record<string, unknown> = {}
  let input = {} as Record<string, unknown>
  let presetId: string | null = null

  const contentType = request.headers.get('content-type') ?? ''
  const isJson = contentType.includes('application/json')

  if (isJson) {
    try {
      body = (await request.json()) as Record<string, unknown>
    } catch {
      /* empty body is acceptable */
    }
  } else {
    try {
      const formData = await request.formData()
      const inputJson = formData.get('inputsJson')
      const directInput = formData.get('input')
      const preset = formData.get('presetId')
      body = {}
      if (typeof inputJson === 'string' && inputJson.trim()) {
        try {
          const parsed = JSON.parse(inputJson)
          if (parsed && typeof parsed === 'object') {
            input = parsed as Record<string, unknown>
          } else {
            return json({ error: 'inputsJson must be an object' }, 400)
          }
        } catch {
          return json({ error: 'invalid inputsJson payload' }, 400)
        }
      } else if (typeof directInput === 'string' && directInput.trim()) {
        try {
          const parsed = JSON.parse(directInput)
          if (parsed && typeof parsed === 'object') {
            input = parsed as Record<string, unknown>
          } else {
            return json({ error: 'input must be an object' }, 400)
          }
        } catch {
          return json({ error: 'invalid input payload' }, 400)
        }
      }

      if (typeof preset === 'string' && preset.trim()) {
        presetId = preset.trim()
      }
    } catch {
      /* non-form request with no body is acceptable */
    }
  }

  if (!isJson) {
    // body remains empty in form-data mode
  } else if (Object.keys(body).length > 0) {
    const payloadInput = body.input
    if (payloadInput && typeof payloadInput === 'object') {
      input = payloadInput as Record<string, unknown>
    } else if (typeof payloadInput === 'string' && payloadInput.trim()) {
      try {
        const parsed = JSON.parse(payloadInput)
        if (parsed && typeof parsed === 'object') {
          input = parsed as Record<string, unknown>
        } else {
          return json({ error: 'input must be an object' }, 400)
        }
      } catch {
        return json({ error: 'invalid input payload' }, 400)
      }
    }

    if (typeof body.inputsJson === 'string' && !('input' in body)) {
      const rawInput = body.inputsJson
      if (rawInput.trim()) {
        try {
          const parsed = JSON.parse(rawInput)
          if (parsed && typeof parsed === 'object') {
            input = parsed as Record<string, unknown>
          } else {
            return json({ error: 'inputsJson must be an object' }, 400)
          }
        } catch {
          return json({ error: 'invalid inputsJson payload' }, 400)
        }
      }
    }

    if (typeof body.presetId === 'string') {
      presetId = body.presetId
    } else if (typeof body.presetId !== 'undefined') {
      return json({ error: 'presetId must be a string' }, 400)
    }
  }

  if (Object.keys(input).length === 0 && body.input === undefined && body.inputsJson === undefined) {
    input = {}
  }
  const flowRunId = crypto.randomUUID()
  const now = nowMs()
  const flowRunColumns = await getTableColumns(db, 'flow_runs')
  const inputColumn = flowRunColumns.has('input_json') ? 'input_json' : 'inputs_json'
  const insertColumns = ['flow_run_id', 'flow_id', 'preset_id', 'status', inputColumn, 'created_at', 'started_at', 'updated_at']
  const values: unknown[] = [flowRunId, flowId, presetId, 'queued', JSON.stringify(input), now, now, now]

  if (flowRunColumns.has('flow_version')) {
    insertColumns.push('flow_version')
    values.push(1)
  }
  if (flowRunColumns.has('trigger')) {
    insertColumns.push('trigger')
    values.push('console')
  }

  await db
    .prepare(`INSERT INTO flow_runs (${insertColumns.join(', ')}) VALUES (${insertColumns.map(() => '?').join(', ')})`)
    .bind(...values)
    .run()

  const accept = request.headers.get('accept') ?? ''
  const wantsHtml = accept.includes('text/html')
  if (!isJson && wantsHtml) {
    return new Response('', {
      status: 303,
      headers: {
        Location: `/admin/console/runs/${flowRunId}`,
      },
    })
  }

  return json({ flowRunId, status: 'queued' }, 201)
}
