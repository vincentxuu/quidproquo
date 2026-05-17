import { AgentApprovalExpired, AgentApprovalRejected } from './errors'

type Resolver = {
  resolve: () => void
  reject: (error: Error) => void
}

const approvals = new Map<string, Resolver>()

export function waitForApproval(approvalId: string): Promise<void> {
  return new Promise((resolve, reject) => {
    approvals.set(approvalId, { resolve, reject })
  })
}

export function resolveWaitingApproval(approvalId: string): void {
  approvals.get(approvalId)?.resolve()
  approvals.delete(approvalId)
}

export function rejectWaitingApproval(approvalId: string): void {
  approvals.get(approvalId)?.reject(new AgentApprovalRejected(approvalId))
  approvals.delete(approvalId)
}

export function expireWaitingApproval(approvalId: string): void {
  approvals.get(approvalId)?.reject(new AgentApprovalExpired(approvalId))
  approvals.delete(approvalId)
}
