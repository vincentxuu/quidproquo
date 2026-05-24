import type { PolicyApprovalGates } from '../../approval-gates'
import type { HumanPolicy } from '../../schema/body'
import type { Flags } from '../../../config/flags'

export function wrapSyscallWithGate(
  syscall: (name: string, input: unknown) => Promise<unknown>,
  opts: {
    runId: string
    stepId: string
    gates: PolicyApprovalGates
    humanPolicy: HumanPolicy
    flags: Flags
    kernel: unknown
  },
): (name: string, input: unknown) => Promise<unknown> {
  if (!opts.flags.agentPolicy?.humanGates || !opts.humanPolicy) {
    return syscall
  }
  return async (name: string, input: unknown) => {
    const result = await opts.gates.requestGate({
      runId: opts.runId,
      stepId: opts.stepId,
      mode: opts.humanPolicy.mode ?? 'per_step',
      syscallName: name,
      input,
      kernel: opts.kernel,
      ttlSeconds: opts.humanPolicy.ttl_seconds ?? 86400,
      windowSeconds: opts.humanPolicy.batch_window_seconds,
      riskThreshold: opts.humanPolicy.risk_threshold,
    })
    if (result.decision === 'reject') {
      throw new Error(
        `Syscall '${name}' rejected by human gate${result.skipped ? ' (skipped)' : ''}`,
      )
    }
    return syscall(name, result.editedPayload !== undefined ? result.editedPayload : input)
  }
}
