import { requestPerStep } from './per-step'

export interface EditOnApprovalRequest {
  runId: string
  stepId: string
  action: string
  payload: unknown
  kernel: unknown
  ttlSeconds: number
}

export interface EditOnApprovalResult {
  decision: 'approve' | 'reject'
  editedPayload?: unknown
}

export async function requestEditOnApproval(req: EditOnApprovalRequest): Promise<EditOnApprovalResult> {
  return requestPerStep({
    runId: req.runId,
    stepId: req.stepId,
    action: req.action,
    kernel: patchKernelForEdit(req.kernel, req.payload),
    ttlSeconds: req.ttlSeconds,
  })
}

function patchKernelForEdit(kernel: unknown, currentPayload: unknown): unknown {
  // Wrap requestApproval to inject currentPayload into context
  const base = kernel as { access?: { requestApproval?: Function } }
  if (!base?.access?.requestApproval) return kernel
  return {
    ...base,
    access: {
      ...base.access,
      requestApproval: async (args: Record<string, unknown>) =>
        base.access!.requestApproval!({ ...args, context: { ...((args.context as Record<string, unknown>) ?? {}), mode: 'edit_on_approval', currentPayload } }),
    },
  }
}
