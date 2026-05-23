import type { D1Database } from '@cloudflare/workers-types'
import { nowMs } from '@/lib/utils/dates'

export async function beginStep(
  db: D1Database,
  opts: { flowRunId: string; stepId: string; stepOrder: number; kind: string }
): Promise<string> {
  const stepRunId = crypto.randomUUID()
  const now = nowMs()
  await db
    .prepare(
      `INSERT INTO flow_step_runs (step_run_id, flow_run_id, step_id, step_order, kind, status, started_at, created_at)
     VALUES (?, ?, ?, ?, ?, 'running', ?, ?)`
    )
    .bind(stepRunId, opts.flowRunId, opts.stepId, opts.stepOrder, opts.kind, now, now)
    .run()
  return stepRunId
}

export async function endStep(
  db: D1Database,
  stepRunId: string,
  opts: { status: string; outputsJson?: string; errorJson?: string; startedAt: number }
): Promise<void> {
  const now = nowMs()
  await db
    .prepare(
      `UPDATE flow_step_runs
     SET status=?, finished_at=?, latency_ms=?, outputs_json=?, error_json=?
     WHERE step_run_id=?`
    )
    .bind(opts.status, now, now - opts.startedAt, opts.outputsJson ?? null, opts.errorJson ?? null, stepRunId)
    .run()
}
