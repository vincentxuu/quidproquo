import type { PolicyBody } from '../../schema/body'
import type { PolicyBindingBackend, PolicyBindingRow } from '../types'

function nowMs(): number {
  return Date.now()
}

function rowToRecord(row: Record<string, unknown>): PolicyBindingRow {
  return {
    bindingId: Number(row.binding_id),
    policyId: Number(row.policy_id),
    scope: String(row.scope) as PolicyBindingRow['scope'],
    flowRunId: row.flow_run_id != null ? Number(row.flow_run_id) : null,
    flowDefinitionId: row.flow_definition_id != null ? Number(row.flow_definition_id) : null,
    agentId: row.agent_id != null ? String(row.agent_id) : null,
    frozenEffective: row.frozen_effective_json
      ? (JSON.parse(String(row.frozen_effective_json)) as PolicyBody)
      : null,
    createdAt: Number(row.created_at),
  }
}

export class D1PolicyBindingBackend implements PolicyBindingBackend {
  constructor(private readonly db: D1Database) {}

  async insert(opts: {
    policyId: number
    scope: string
    flowRunId?: number
    flowDefinitionId?: number
    agentId?: string
    frozenEffective?: PolicyBody
  }): Promise<number> {
    const now = nowMs()
    const result = await this.db.prepare(
      `INSERT INTO policy_bindings (policy_id, scope, flow_run_id, flow_definition_id, agent_id, frozen_effective_json, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      opts.policyId,
      opts.scope,
      opts.flowRunId ?? null,
      opts.flowDefinitionId ?? null,
      opts.agentId ?? null,
      opts.frozenEffective != null ? JSON.stringify(opts.frozenEffective) : null,
      now,
    ).run()
    return Number(result.meta.last_row_id)
  }

  async getByFlowRun(flowRunId: number): Promise<PolicyBindingRow | null> {
    const row = await this.db.prepare(
      `SELECT * FROM policy_bindings WHERE flow_run_id = ? ORDER BY binding_id DESC LIMIT 1`
    ).bind(flowRunId).first<Record<string, unknown>>()
    return row ? rowToRecord(row) : null
  }

  async listByFlowDefinition(flowDefinitionId: number): Promise<PolicyBindingRow[]> {
    const result = await this.db.prepare(
      `SELECT * FROM policy_bindings WHERE flow_definition_id = ? ORDER BY binding_id ASC`
    ).bind(flowDefinitionId).all<Record<string, unknown>>()
    return (result.results ?? []).map(rowToRecord)
  }

  async listByAgent(agentId: string): Promise<PolicyBindingRow[]> {
    const result = await this.db.prepare(
      `SELECT * FROM policy_bindings WHERE agent_id = ? ORDER BY binding_id ASC`
    ).bind(agentId).all<Record<string, unknown>>()
    return (result.results ?? []).map(rowToRecord)
  }

  async listGlobal(): Promise<PolicyBindingRow[]> {
    const result = await this.db.prepare(
      `SELECT * FROM policy_bindings WHERE scope = 'global' ORDER BY binding_id ASC`
    ).all<Record<string, unknown>>()
    return (result.results ?? []).map(rowToRecord)
  }
}
