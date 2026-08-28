import type { StepExecutor } from '../step-executor'
import { registerStepExecutor } from '../step-executor'

const humanApprovalExecutor: StepExecutor = async (step, ctx, _state) => {
  if (step.type !== 'human_approval') {
    return { outputs: {}, status: 'failed', errorJson: { kind: 'type_mismatch' } }
  }

  const reason = (step as Record<string, unknown>).reason as string | undefined ?? 'human_approval_required'
  const ttlSeconds = (step as Record<string, unknown>).ttlSeconds as number | undefined ?? 86400

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const requestApproval = (ctx.kernel as any)?.access?.requestApproval as
      | ((opts: unknown) => Promise<{ decision: 'approve' | 'reject' | 'expire' } | undefined>)
      | undefined

    const result = await requestApproval?.({
      runId: ctx.flowRunId,
      reason,
      context: { stepId: step.id },
      ttlSeconds,
    })

    const d = result?.decision ?? 'expire'

    if (d === 'approve') {
      return { outputs: { decision: 'approve' }, status: 'done' }
    }
    return {
      outputs: { decision: d },
      status: 'failed',
      errorJson: { kind: `human_approval_${d}` },
    }
  } catch (err) {
    return {
      outputs: { decision: 'error' },
      status: 'failed',
      errorJson: { kind: 'human_approval_error', message: String(err) },
    }
  }
}

registerStepExecutor('human_approval', humanApprovalExecutor)
export { humanApprovalExecutor }
