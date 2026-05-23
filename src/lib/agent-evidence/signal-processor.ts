import type { Evidence } from './index'
import { domainOf } from './extraction/domain'

export async function onApprovalResolved(
  approvalId: string,
  decision: 'approve' | 'reject' | 'expire',
  flowRunId: string,
  evidence: Evidence,
  reason?: string,
): Promise<void> {
  // Look up all sources cited in this flow run and update reputation for each
  try {
    const bundle = await evidence.store.getFlowRunBundle(flowRunId)
    for (const source of bundle.sources) {
      await evidence.reputation.updateFromSignal(domainOf(source.url), decision === 'expire' ? 'reject' : decision)
    }
  } catch {
    // Non-fatal: reputation updates must not affect the calling flow
  }

  // Update conflict status if this approval was for an evidence conflict
  if (reason === 'evidence_conflict') {
    const statusMap: Record<string, 'approved' | 'rejected' | 'expired'> = {
      approve: 'approved',
      reject: 'rejected',
      expire: 'expired',
    }
    const newStatus = statusMap[decision] ?? 'expired'
    try {
      const conflict = await evidence.backends.conflicts.getByApprovalId(String(approvalId))
      if (conflict) {
        await evidence.backends.conflicts.updateStatus(conflict.conflictId, newStatus)
      }
    } catch {
      // Non-fatal: approval already resolved or conflict not found
    }
  }
}
