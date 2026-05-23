// In-memory batch window per flow run. Lost on Worker restart — Phase 9 uses Durable Objects.
const windows = new Map<string, { actions: unknown[]; resolvers: Array<(r: { decision: 'approve' | 'reject' }) => void>; timer?: ReturnType<typeof setTimeout> }>()

export interface BatchRequest {
  runId: string
  stepId: string
  action: string
  kernel: unknown
  windowSeconds: number
  ttlSeconds: number
}

export async function requestBatch(req: BatchRequest): Promise<{ decision: 'approve' | 'reject' }> {
  return new Promise((resolve) => {
    const key = req.runId
    let win = windows.get(key)
    if (!win) {
      win = { actions: [], resolvers: [] }
      windows.set(key, win)
      win.timer = setTimeout(async () => {
        windows.delete(key)
        const w = win!
        const kernelAccess = (req.kernel as { access?: { requestApproval?: Function } })?.access
        if (!kernelAccess?.requestApproval) {
          w.resolvers.forEach(r => r({ decision: 'approve' }))
          return
        }
        const approvalId: string = await kernelAccess.requestApproval({
          runId: req.runId,
          reason: 'policy_human_gate',
          context: { mode: 'batch', actions: w.actions },
          ttlSeconds: req.ttlSeconds,
        })
        const awaitFn = (req.kernel as { access?: { awaitApproval?: Function } })?.access?.awaitApproval
        const result = awaitFn ? await awaitFn(approvalId) : { decision: 'approve' }
        w.resolvers.forEach(r => r({ decision: result?.decision ?? 'approve' }))
      }, req.windowSeconds * 1000)
    }
    win.actions.push({ stepId: req.stepId, action: req.action })
    win.resolvers.push(resolve)
  })
}
