import { nowMs } from '../utils/dates'
import { AgentAccessDenied, AgentApprovalExpired, PermissionsChangedWithoutVersionBump } from './errors'
import { expireWaitingApproval, rejectWaitingApproval, resolveWaitingApproval, waitForApproval } from './approval-queue'
import type { AgentOsBackends } from './storage'
import type { ApprovalRecord, PermissionRecord } from './storage/types'

export interface AgentDefinition<TInput = unknown, TOutput = unknown> {
  id: string
  version: number
  displayName?: string
  description?: string
  schedule?: string
  syscalls: string[]
  memoryScopes: string[]
  secrets: string[]
  outboundDomains: string[]
  toolCallLimit: number
  timeoutSeconds: number
  maxConcurrent?: number
  approvalTtlSeconds?: number
  irreversibleActionsRequireApproval?: boolean
  run: (input: TInput, context: unknown) => Promise<TOutput>
}

export function defineAgent<TInput = unknown, TOutput = unknown>(
  definition: AgentDefinition<TInput, TOutput>
): AgentDefinition<TInput, TOutput> {
  validateAgentDefinition(definition)
  return definition
}

export function computeGrantsHash(definition: Pick<AgentDefinition, 'syscalls' | 'memoryScopes' | 'secrets' | 'outboundDomains' | 'irreversibleActionsRequireApproval'>): string {
  return JSON.stringify({
    syscalls: [...definition.syscalls].sort(),
    memoryScopes: [...definition.memoryScopes].sort(),
    secrets: [...definition.secrets].sort(),
    outboundDomains: [...definition.outboundDomains].sort(),
    irreversibleActionsRequireApproval: definition.irreversibleActionsRequireApproval ?? true,
  })
}

export function validateAgentDefinition(definition: Pick<AgentDefinition<any, any>, 'id' | 'version'>): void {
  if (!definition.id || definition.id === 'system') {
    throw new AgentAccessDenied('invalid_agent_id')
  }
  if (!Number.isInteger(definition.version) || definition.version < 1) {
    throw new Error(`Agent ${definition.id} must declare a positive integer version`)
  }
}

export async function mirrorPermissions(backends: AgentOsBackends, definition: AgentDefinition): Promise<void> {
  const existing = await backends.permissions.get(definition.id)
  const grantsHash = computeGrantsHash(definition)
  if (existing && existing.version === definition.version && existing.grantsHash !== grantsHash) {
    throw new PermissionsChangedWithoutVersionBump(definition.id)
  }
  const permission: PermissionRecord = {
    agentId: definition.id,
    version: definition.version,
    grantsHash,
    syscalls: definition.syscalls,
    memoryScopes: definition.memoryScopes,
    secrets: definition.secrets,
    outboundDomains: definition.outboundDomains,
    irreversibleActionsRequireApproval: definition.irreversibleActionsRequireApproval ?? true,
    updatedAt: nowMs(),
  }
  await backends.permissions.upsert(permission)
}

export function createAccessManager(backends: AgentOsBackends) {
  return {
    async mirrorPermissions(definition: AgentDefinition) {
      validateAgentDefinition(definition)
      await mirrorPermissions(backends, definition)
    },
    async checkSyscall(agentId: string, syscall: string): Promise<void> {
      const permission = await requiredPermission(backends, agentId)
      if (!permission.syscalls.includes(syscall)) {
        throw new AgentAccessDenied('syscall_not_granted')
      }
    },
    async checkMemoryScope(agentId: string, scope: string): Promise<void> {
      const permission = await requiredPermission(backends, agentId)
      if (!permission.memoryScopes.includes(scope)) {
        throw new AgentAccessDenied('cross_scope_memory')
      }
    },
    async checkOutboundDomain(agentId: string, url: string): Promise<void> {
      const permission = await requiredPermission(backends, agentId)
      const host = new URL(url).host
      if (!permission.outboundDomains.some((pattern) => matchesDomain(pattern, host))) {
        throw new AgentAccessDenied('outbound_domain_not_granted')
      }
    },
    async requestApproval(input: { runId: string; reason: string; context: unknown; ttlSeconds?: number }): Promise<string> {
      const approvalId = crypto.randomUUID()
      const record: ApprovalRecord = {
        approvalId,
        runId: input.runId,
        reason: input.reason,
        context: input.context,
        status: 'pending',
        createdAt: nowMs(),
      }
      await backends.approvals.create(record)
      await backends.runs.transition(input.runId, 'paused')
      await waitForApproval(approvalId)
      await backends.runs.transition(input.runId, 'running')
      return approvalId
    },
    async resolveApproval(input: { approvalId: string; decision: 'approved' | 'rejected'; resolvedBy: string }): Promise<void> {
      await backends.approvals.resolve(input.approvalId, {
        status: input.decision,
        resolvedBy: input.resolvedBy,
        resolvedAt: nowMs(),
      })
      if (input.decision === 'approved') resolveWaitingApproval(input.approvalId)
      else rejectWaitingApproval(input.approvalId)
    },
    async expireStaleApprovals(now = nowMs()): Promise<ApprovalRecord[]> {
      const expired = await backends.approvals.expireBefore(now - 86400 * 1000)
      for (const approval of expired) {
        expireWaitingApproval(approval.approvalId)
        await backends.runs.transition(approval.runId, 'failed', {
          error: { reason: 'approval_expired', approvalId: approval.approvalId },
          finishedAt: now,
        })
      }
      if (expired.length > 0) {
        throw new AgentApprovalExpired(expired[0].approvalId)
      }
      return expired
    },
  }
}

async function requiredPermission(backends: AgentOsBackends, agentId: string): Promise<PermissionRecord> {
  const permission = await backends.permissions.get(agentId)
  if (!permission) throw new AgentAccessDenied('agent_permissions_missing')
  return permission
}

function matchesDomain(pattern: string, host: string): boolean {
  if (pattern === host || pattern === '*') return true
  if (pattern.startsWith('*.')) return host.endsWith(pattern.slice(1))
  return false
}
