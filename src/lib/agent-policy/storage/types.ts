import type { PolicyBody } from '../schema/body'

export interface PolicyDefinitionRow {
  policyId: number
  policyKey: string
  version: number
  label: string
  body: PolicyBody
  createdBy: string | null
  createdAt: number
  updatedAt: number
  archivedAt: number | null
}

export interface PolicyBindingRow {
  bindingId: number
  policyId: number
  scope: 'run' | 'flow_definition' | 'agent' | 'global'
  flowRunId: number | null
  flowDefinitionId: number | null
  agentId: string | null
  frozenEffective: PolicyBody | null
  createdAt: number
}

export interface PolicyViolationRow {
  violationId: number
  flowRunId: number | null
  agentRunId: number | null
  policyId: number
  category: 'budget' | 'provider' | 'quality' | 'security' | 'human' | 'retry'
  ruleKey: string
  severity: 'warn' | 'block' | 'kill'
  observedValue: unknown
  limitValue: unknown
  actionTaken: 'logged' | 'blocked' | 'run_killed' | 'approval_gated' | 'request_retried' | 'request_failed'
  partialOutputRef: string | null
  createdAt: number
}

export interface PolicyDefinitionBackend {
  insert(opts: { policyKey: string; version: number; label: string; body: PolicyBody; createdBy?: string }): Promise<number>
  getByKey(policyKey: string, version?: number): Promise<PolicyDefinitionRow | null>
  list(opts?: { archived?: boolean }): Promise<PolicyDefinitionRow[]>
  archive(policyKey: string): Promise<void>
  bumpVersion(policyKey: string, newBody: PolicyBody): Promise<number>
}

export interface PolicyBindingBackend {
  insert(opts: { policyId: number; scope: string; flowRunId?: number; flowDefinitionId?: number; agentId?: string; frozenEffective?: PolicyBody }): Promise<number>
  getByFlowRun(flowRunId: number): Promise<PolicyBindingRow | null>
  listByFlowDefinition(flowDefinitionId: number): Promise<PolicyBindingRow[]>
  listByAgent(agentId: string): Promise<PolicyBindingRow[]>
  listGlobal(): Promise<PolicyBindingRow[]>
}

export interface PolicyViolationBackend {
  insert(opts: { flowRunId?: number; agentRunId?: number; policyId: number; category: string; ruleKey: string; severity: string; observedValue: unknown; limitValue: unknown; actionTaken: string; partialOutputRef?: string }): Promise<number>
  listForFlowRun(flowRunId: number): Promise<PolicyViolationRow[]>
  listByCategory(category: string, opts?: { since?: number; limit?: number }): Promise<PolicyViolationRow[]>
}
