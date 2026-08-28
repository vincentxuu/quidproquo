import type { PolicyBody } from '../../schema/body'
import type {
  PolicyBindingBackend,
  PolicyBindingRow,
  PolicyDefinitionBackend,
  PolicyDefinitionRow,
  PolicyViolationBackend,
  PolicyViolationRow,
} from '../types'

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
}

export class InMemoryPolicyDefinitionBackend implements PolicyDefinitionBackend {
  readonly rows = new Map<number, PolicyDefinitionRow>()
  private nextId = 1

  async insert(opts: { policyKey: string; version: number; label: string; body: PolicyBody; createdBy?: string }): Promise<number> {
    const id = this.nextId++
    const now = Date.now()
    this.rows.set(id, {
      policyId: id,
      policyKey: opts.policyKey,
      version: opts.version,
      label: opts.label,
      body: clone(opts.body),
      createdBy: opts.createdBy ?? null,
      createdAt: now,
      updatedAt: now,
      archivedAt: null,
    })
    return id
  }

  async getByKey(policyKey: string, version?: number): Promise<PolicyDefinitionRow | null> {
    const matches = [...this.rows.values()]
      .filter(r => r.policyKey === policyKey && r.archivedAt === null)
      .filter(r => version === undefined || r.version === version)
      .sort((a, b) => b.version - a.version)
    return matches.length > 0 ? clone(matches[0]) : null
  }

  async list(opts?: { archived?: boolean }): Promise<PolicyDefinitionRow[]> {
    return [...this.rows.values()]
      .filter(r => opts?.archived ? true : r.archivedAt === null)
      .map(clone)
  }

  async archive(policyKey: string): Promise<void> {
    const now = Date.now()
    for (const [id, row] of this.rows) {
      if (row.policyKey === policyKey) {
        this.rows.set(id, { ...row, archivedAt: now })
      }
    }
  }

  async bumpVersion(policyKey: string, newBody: PolicyBody): Promise<number> {
    const current = await this.getByKey(policyKey)
    const nextVersion = current ? current.version + 1 : 1
    return this.insert({
      policyKey,
      version: nextVersion,
      label: current?.label ?? policyKey,
      body: newBody,
      createdBy: current?.createdBy ?? undefined,
    })
  }
}

export class InMemoryPolicyBindingBackend implements PolicyBindingBackend {
  readonly rows = new Map<number, PolicyBindingRow>()
  private nextId = 1

  async insert(opts: {
    policyId: number
    scope: string
    flowRunId?: number
    flowDefinitionId?: number
    agentId?: string
    frozenEffective?: PolicyBody
  }): Promise<number> {
    const id = this.nextId++
    this.rows.set(id, {
      bindingId: id,
      policyId: opts.policyId,
      scope: opts.scope as PolicyBindingRow['scope'],
      flowRunId: opts.flowRunId ?? null,
      flowDefinitionId: opts.flowDefinitionId ?? null,
      agentId: opts.agentId ?? null,
      frozenEffective: opts.frozenEffective ? clone(opts.frozenEffective) : null,
      createdAt: Date.now(),
    })
    return id
  }

  async getByFlowRun(flowRunId: number): Promise<PolicyBindingRow | null> {
    const matches = [...this.rows.values()]
      .filter(r => r.flowRunId === flowRunId)
      .sort((a, b) => b.bindingId - a.bindingId)
    return matches.length > 0 ? clone(matches[0]) : null
  }

  async listByFlowDefinition(flowDefinitionId: number): Promise<PolicyBindingRow[]> {
    return [...this.rows.values()]
      .filter(r => r.flowDefinitionId === flowDefinitionId)
      .map(clone)
  }

  async listByAgent(agentId: string): Promise<PolicyBindingRow[]> {
    return [...this.rows.values()]
      .filter(r => r.agentId === agentId)
      .map(clone)
  }

  async listGlobal(): Promise<PolicyBindingRow[]> {
    return [...this.rows.values()]
      .filter(r => r.scope === 'global')
      .map(clone)
  }
}

export class InMemoryPolicyViolationBackend implements PolicyViolationBackend {
  readonly rows = new Map<number, PolicyViolationRow>()
  private nextId = 1

  async insert(opts: {
    flowRunId?: number
    agentRunId?: number
    policyId: number
    category: string
    ruleKey: string
    severity: string
    observedValue: unknown
    limitValue: unknown
    actionTaken: string
    partialOutputRef?: string
  }): Promise<number> {
    const id = this.nextId++
    this.rows.set(id, {
      violationId: id,
      flowRunId: opts.flowRunId ?? null,
      agentRunId: opts.agentRunId ?? null,
      policyId: opts.policyId,
      category: opts.category as PolicyViolationRow['category'],
      ruleKey: opts.ruleKey,
      severity: opts.severity as PolicyViolationRow['severity'],
      observedValue: clone(opts.observedValue),
      limitValue: clone(opts.limitValue),
      actionTaken: opts.actionTaken as PolicyViolationRow['actionTaken'],
      partialOutputRef: opts.partialOutputRef ?? null,
      createdAt: Date.now(),
    })
    return id
  }

  async listForFlowRun(flowRunId: number): Promise<PolicyViolationRow[]> {
    return [...this.rows.values()]
      .filter(r => r.flowRunId === flowRunId)
      .map(clone)
  }

  async listByCategory(category: string, opts?: { since?: number; limit?: number }): Promise<PolicyViolationRow[]> {
    return [...this.rows.values()]
      .filter(r => r.category === category)
      .filter(r => opts?.since === undefined || r.createdAt >= opts.since)
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, opts?.limit ?? 100)
      .map(clone)
  }
}
