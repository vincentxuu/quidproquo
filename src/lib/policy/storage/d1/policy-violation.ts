import type { PolicyViolationBackend, PolicyViolationRow } from '../types'

function nowMs(): number {
  return Date.now()
}

function rowToRecord(row: Record<string, unknown>): PolicyViolationRow {
  return {
    violationId: Number(row.violation_id),
    flowRunId: row.flow_run_id != null ? Number(row.flow_run_id) : null,
    agentRunId: row.agent_run_id != null ? Number(row.agent_run_id) : null,
    policyId: Number(row.policy_id),
    category: String(row.category) as PolicyViolationRow['category'],
    ruleKey: String(row.rule_key),
    severity: String(row.severity) as PolicyViolationRow['severity'],
    observedValue: JSON.parse(String(row.observed_value_json)),
    limitValue: JSON.parse(String(row.limit_value_json)),
    actionTaken: String(row.action_taken) as PolicyViolationRow['actionTaken'],
    partialOutputRef: row.partial_output_ref != null ? String(row.partial_output_ref) : null,
    createdAt: Number(row.created_at),
  }
}

export class D1PolicyViolationBackend implements PolicyViolationBackend {
  constructor(private readonly db: D1Database) {}

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
    const now = nowMs()
    const result = await this.db.prepare(
      `INSERT INTO policy_violations (flow_run_id, agent_run_id, policy_id, category, rule_key, severity, observed_value_json, limit_value_json, action_taken, partial_output_ref, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      opts.flowRunId ?? null,
      opts.agentRunId ?? null,
      opts.policyId,
      opts.category,
      opts.ruleKey,
      opts.severity,
      JSON.stringify(opts.observedValue),
      JSON.stringify(opts.limitValue),
      opts.actionTaken,
      opts.partialOutputRef ?? null,
      now,
    ).run()
    return Number(result.meta.last_row_id)
  }

  async listForFlowRun(flowRunId: number): Promise<PolicyViolationRow[]> {
    const result = await this.db.prepare(
      `SELECT * FROM policy_violations WHERE flow_run_id = ? ORDER BY created_at ASC`
    ).bind(flowRunId).all<Record<string, unknown>>()
    return (result.results ?? []).map(rowToRecord)
  }

  async listByCategory(category: string, opts?: { since?: number; limit?: number }): Promise<PolicyViolationRow[]> {
    const clauses: string[] = ['category = ?']
    const values: unknown[] = [category]
    if (opts?.since !== undefined) {
      clauses.push('created_at >= ?')
      values.push(opts.since)
    }
    const limit = opts?.limit ?? 100
    values.push(limit)
    const result = await this.db.prepare(
      `SELECT * FROM policy_violations WHERE ${clauses.join(' AND ')} ORDER BY created_at DESC LIMIT ?`
    ).bind(...values).all<Record<string, unknown>>()
    return (result.results ?? []).map(rowToRecord)
  }
}
