export interface PerStepRequest {
  runId: string
  stepId: string
  action: string
  kernel: unknown
  ttlSeconds: number
}

export interface PerStepResult {
  decision: 'approve' | 'reject'
  editedPayload?: unknown
}

export async function requestPerStep(req: PerStepRequest): Promise<PerStepResult> {
  const kernelAccess = (req.kernel as { access?: { requestApproval?: Function } })?.access
  if (!kernelAccess?.requestApproval) {
    // No kernel approval mechanism — default approve (gates only fire when kernel is wired)
    return { decision: 'approve' }
  }
  const approvalId: string = await kernelAccess.requestApproval({
    runId: req.runId,
    reason: 'policy_human_gate',
    context: { mode: 'per_step', stepId: req.stepId, action: req.action },
    ttlSeconds: req.ttlSeconds,
  })
  // Await resolution via kernel.access.awaitApproval (structural)
  const kernelAwait = (req.kernel as { access?: { awaitApproval?: Function } })?.access
  if (!kernelAwait?.awaitApproval) return { decision: 'approve' }
  const result = await kernelAwait.awaitApproval(approvalId)
  return { decision: result?.decision ?? 'approve', editedPayload: result?.editedPayload }
}
