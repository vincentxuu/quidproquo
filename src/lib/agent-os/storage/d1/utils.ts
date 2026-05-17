import type {
  AgentProcessRecord,
  AgentRunRecord,
  ApprovalRecord,
  MemoryRecord,
  PermissionRecord,
} from '../types'

export function encodeJson(value: unknown): string {
  return JSON.stringify(value ?? null)
}

export function decodeJson<T = unknown>(raw: string | null | undefined, fallback: T): T {
  if (!raw) return fallback
  try {
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function processFromRow(row: Record<string, unknown>): AgentProcessRecord {
  return {
    agentId: String(row.agent_id),
    version: Number(row.version),
    displayName: String(row.display_name),
    description: row.description ? String(row.description) : undefined,
    schedule: row.schedule ? String(row.schedule) : undefined,
    toolCallLimit: Number(row.tool_call_limit),
    timeoutSeconds: Number(row.timeout_seconds),
    maxConcurrent: Number(row.max_concurrent),
    approvalTtlSeconds: Number(row.approval_ttl_seconds),
    createdAt: Number(row.created_at),
    updatedAt: Number(row.updated_at),
  }
}

export function runFromRow(row: Record<string, unknown>): AgentRunRecord {
  return {
    runId: String(row.run_id),
    agentId: String(row.agent_id),
    agentVersion: Number(row.agent_version),
    status: row.status as AgentRunRecord['status'],
    trigger: row.trigger as AgentRunRecord['trigger'],
    parentRunId: row.parent_run_id ? String(row.parent_run_id) : undefined,
    input: decodeJson(row.input_json as string, null),
    output: decodeJson(row.output_json as string | null, undefined),
    error: decodeJson(row.error_json as string | null, undefined),
    cancelSignal: Number(row.cancel_signal ?? 0) === 1,
    startedAt: Number(row.started_at),
    finishedAt: row.finished_at == null ? undefined : Number(row.finished_at),
    totalTokens: Number(row.total_tokens ?? 0),
    totalCostUsd: Number(row.total_cost_usd ?? 0),
    totalToolCalls: Number(row.total_tool_calls ?? 0),
  }
}

export function permissionFromRow(row: Record<string, unknown>): PermissionRecord {
  return {
    agentId: String(row.agent_id),
    version: Number(row.version),
    grantsHash: String(row.grants_hash),
    syscalls: decodeJson<string[]>(row.syscalls_json as string, []),
    memoryScopes: decodeJson<string[]>(row.memory_scopes_json as string, []),
    secrets: decodeJson<string[]>(row.secrets_json as string, []),
    outboundDomains: decodeJson<string[]>(row.outbound_domains_json as string, []),
    irreversibleActionsRequireApproval: Number(row.irreversible_actions_require_approval ?? 1) === 1,
    updatedAt: Number(row.updated_at),
  }
}

export function approvalFromRow(row: Record<string, unknown>): ApprovalRecord {
  return {
    approvalId: String(row.approval_id),
    runId: String(row.run_id),
    reason: String(row.reason),
    context: decodeJson(row.context_json as string, null),
    status: row.status as ApprovalRecord['status'],
    resolvedBy: row.resolved_by ? String(row.resolved_by) : undefined,
    resolvedAt: row.resolved_at == null ? undefined : Number(row.resolved_at),
    createdAt: Number(row.created_at),
  }
}

export function memoryFromRow(row: Record<string, unknown>): MemoryRecord {
  return {
    itemId: String(row.item_id),
    scopeKey: String(row.scope_key),
    memoryType: row.memory_type as MemoryRecord['memoryType'],
    bodyText: String(row.body_text ?? ''),
    bodyJson: decodeJson(row.body_json as string | null, undefined),
    entities: decodeJson<string[]>(row.entities_json as string | null, []),
    vectorId: row.vector_id ? String(row.vector_id) : undefined,
    importance: Number(row.importance ?? 0),
    writtenAt: Number(row.written_at),
    expiresAt: row.expires_at == null ? undefined : Number(row.expires_at),
    lastReadAt: row.last_read_at == null ? undefined : Number(row.last_read_at),
  }
}
