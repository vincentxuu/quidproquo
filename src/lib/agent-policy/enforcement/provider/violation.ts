import type { PolicyViolationBackend } from '../../storage/types'

export async function logProviderViolation(
  opts: {
    flowRunId: string
    policyId: number
    requestedProvider: string
    deniedBy: string
    allowlist?: string[]
    denylist?: string[]
    actionTaken: 'request_retried' | 'blocked'
    severity: 'warn' | 'block'
    violationBackend: Pick<PolicyViolationBackend, 'insert'>
  },
): Promise<void> {
  try {
    await opts.violationBackend.insert({
      flowRunId: Number(opts.flowRunId),
      policyId: opts.policyId,
      category: 'provider',
      ruleKey: 'provider_check',
      severity: opts.severity,
      observedValue: opts.requestedProvider,
      limitValue: JSON.stringify({ allowlist: opts.allowlist, denylist: opts.denylist }),
      actionTaken: opts.actionTaken,
    })
  } catch {
    // Non-fatal: violation logging must not block the request
  }
}
