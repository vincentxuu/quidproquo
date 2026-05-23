export const prerender = false

import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'
import { requireAdmin } from '@/lib/auth/admin'
import type { Env } from '@/lib/config/env'

interface StepRow {
  step_run_id: string
  step_id: string
  kind: string
  status: string
  attempt: number
  started_at: number | null
  finished_at: number | null
  latency_ms: number | null
  updated_at: number | null
  created_at: number
  step_order: number
}

interface RunRow {
  status: string
  started_at: number
}

interface ApprovalRow {
  approval_id: string
  run_id: string
  reason: string
  context_json: string
  created_at: number
}

interface ApprovalPayload {
  approvalId: string
  runId: string
  reason: string
  context: unknown
  createdAt: number
}

interface EventPayload {
  run: { status: string }
  steps: StepRow[]
  approvals: ApprovalPayload[]
  cursor: string
  terminal: boolean
}

const terminalStatuses = new Set(['done', 'failed', 'cancelled'])

interface CursorParts {
  runUpdatedAt: number
  runStatus: string
  stepVersion: number
  stepUpdatedAt: number
  approvalUpdatedAt: number
  stepCount: number
  approvalCount: number
}

function encodeCursor(parts: CursorParts): string {
  return `${parts.runUpdatedAt}|${parts.runStatus}|${parts.stepVersion}|${parts.stepUpdatedAt}|${parts.approvalUpdatedAt}|${parts.stepCount}|${parts.approvalCount}`
}

function buildCursor(
  runStatus: string,
  runStartedAt: number,
  steps: StepRow[],
  approvals: ApprovalPayload[],
): CursorParts {
  const stepUpdatedAt = steps.reduce((max, step) => Math.max(max, step.updated_at ?? 0, step.finished_at ?? 0), 0)
  const approvalUpdatedAt = approvals.reduce((max, approval) => Math.max(max, approval.createdAt), 0)
  const stepVersion = steps.reduce((max, step) => {
    const updated = Math.max(step.created_at, step.updated_at ?? step.created_at)
    return Math.max(max, updated)
  }, 0)

  return {
    runUpdatedAt: runStartedAt,
    runStatus,
    stepVersion,
    stepUpdatedAt,
    approvalUpdatedAt,
    stepCount: steps.length,
    approvalCount: approvals.length,
  }
}

export const GET: APIRoute = async ({ cookies, params, request }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response

  const runId = params.runId
  if (!runId) {
    return new Response('run_id_required', { status: 400 })
  }

  const db = (env as unknown as Env).DB
  const lastSeenCursorRaw = request.headers.get('last-event-id')

  const run = await db
    .prepare('SELECT status FROM flow_runs WHERE flow_run_id = ? LIMIT 1')
    .bind(runId)
    .first<RunRow>()
  if (!run) {
    return new Response('run not found', { status: 404 })
  }

  const encoder = new TextEncoder()
  let lastSentCursor = ''

  const send = (
    controller: ReadableStreamDefaultController<Uint8Array>,
    payload: EventPayload,
    eventName: string,
  ): void => {
    const data = `id: ${Date.now()}\n` +
      `event: ${eventName}\n` +
      `retry: 1500\n` +
      `data: ${JSON.stringify(payload)}\n\n`
    controller.enqueue(encoder.encode(data))
  }

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const poll = async () => {
    const [runResult, stepResult, approvalResult] = await Promise.all([
          db
            .prepare('SELECT status, started_at FROM flow_runs WHERE flow_run_id = ? LIMIT 1')
            .bind(runId)
            .first<RunRow>(),
          db
            .prepare(
              `SELECT step_run_id,
                      step_id,
                      step_type AS kind,
                      status,
                      attempt,
                      started_at,
                      finished_at,
                      latency_ms,
                      created_at,
                      updated_at,
                      step_order
               FROM flow_step_runs
               WHERE flow_run_id = ?
               ORDER BY step_order ASC, attempt ASC, created_at ASC`,
            )
            .bind(runId)
            .all<StepRow>(),
          db
            .prepare(
            `SELECT approval_id, run_id, reason, context_json, created_at
               FROM agent_approval_requests
               WHERE status = 'pending' AND run_id = ?
               ORDER BY created_at ASC`,
            )
            .bind(runId)
            .all<ApprovalRow>(),
        ])

        if (!runResult) {
          controller.close()
          return
        }

        const approvals = ((approvalResult.results ?? []) as ApprovalRow[]).map((r) => ({
          approvalId: String(r.approval_id),
          runId: String(r.run_id),
          reason: String(r.reason),
          context: parseJson(r.context_json),
          createdAt: Number(r.created_at),
        }))

        const payload: EventPayload = {
          run: { status: String(runResult.status) },
          steps: (stepResult.results ?? []) as StepRow[],
          approvals,
          terminal: terminalStatuses.has(String(runResult.status)),
          cursor: '',
        }

        const cursorParts = buildCursor(payload.run.status, runResult.started_at, payload.steps as StepRow[], payload.approvals)
        payload.cursor = encodeCursor(cursorParts)

        const cursorChanged = payload.cursor !== lastSentCursor
        const shouldSend = lastSeenCursorRaw === null || payload.cursor !== lastSeenCursorRaw
        if (shouldSend) {
          send(controller, payload, 'timeline')
          lastSentCursor = payload.cursor
        }

        if (terminalStatuses.has(payload.run.status)) {
          send(
            controller,
            {
              ...payload,
              terminal: true,
              run: { status: payload.run.status },
            },
            'terminal',
          )
          controller.close()
          return
        }

        await new Promise((resolve) => setTimeout(resolve, 1000))
        await poll()
      }

      try {
        await poll()
      } catch {
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      'content-type': 'text/event-stream',
      'cache-control': 'no-cache',
      connection: 'keep-alive',
      'x-content-type-options': 'nosniff',
    },
  })
}

function parseJson(raw: string): unknown {
  try {
    return JSON.parse(raw)
  } catch {
    return {}
  }
}
