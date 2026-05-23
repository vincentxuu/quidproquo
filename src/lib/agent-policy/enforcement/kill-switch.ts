import { flowCancelKey } from '../../agent-flow/runtime/cancel'
import type { FlowCancelStore } from '../../agent-flow/runtime/cancel'

export interface KillSwitchOptions {
  flowRunId: string
  reason: string
  violationId?: number
  partialOutputRef?: string
}

export interface KillSwitchDeps {
  kv: Pick<FlowCancelStore, 'put'>
  db: D1Database
}

const _killing = new Set<string>()

export async function killFlowRun(opts: KillSwitchOptions, deps: KillSwitchDeps): Promise<void> {
  if (_killing.has(opts.flowRunId)) return  // idempotent
  _killing.add(opts.flowRunId)
  try {
    const errorJson = JSON.stringify({
      kind: opts.reason,
      violationId: opts.violationId,
      partialOutputRef: opts.partialOutputRef,
    })

    await Promise.all([
      deps.kv.put(flowCancelKey(opts.flowRunId), '1'),
      deps.db.prepare(`
        UPDATE flow_runs
        SET status = 'failed',
            error_json = ?,
            updated_at = ?
        WHERE flow_run_id = ? AND status NOT IN ('done', 'failed', 'cancelled')
      `).bind(errorJson, Date.now(), opts.flowRunId).run(),
    ])
  } finally {
    _killing.delete(opts.flowRunId)
  }
}
