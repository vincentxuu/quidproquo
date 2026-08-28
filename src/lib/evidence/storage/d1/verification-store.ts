import type { VerificationRecord, VerificationStoreBackend } from '../types'

const nowMs = () => Date.now()

function rowToVerificationRecord(row: Record<string, unknown>): VerificationRecord {
  return {
    verificationId: row.verification_id as number,
    flowRunId: row.flow_run_id as string,
    policyJson: row.policy_json as string,
    passed: Boolean(row.passed),
    checksJson: row.checks_json as string,
    gapsJson: row.gaps_json as string,
    performedAt: row.performed_at as number,
    createdAt: row.created_at as number,
  }
}

export class D1VerificationStoreBackend implements VerificationStoreBackend {
  constructor(private readonly db: D1Database) {}

  async insert(input: Parameters<VerificationStoreBackend['insert']>[0]): Promise<number> {
    const now = nowMs()
    const result = await this.db
      .prepare(
        `INSERT INTO evidence_verifications
          (flow_run_id, policy_json, passed, checks_json, gaps_json, performed_at, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        input.flowRunId,
        input.policyJson,
        input.passed ? 1 : 0,
        input.checksJson,
        input.gapsJson,
        input.performedAt,
        now,
      )
      .run()
    return Number(result.meta.last_row_id)
  }

  async getByFlowRun(flowRunId: string): Promise<VerificationRecord[]> {
    const result = await this.db
      .prepare(
        'SELECT * FROM evidence_verifications WHERE flow_run_id = ? ORDER BY performed_at ASC',
      )
      .bind(flowRunId)
      .all<Record<string, unknown>>()
    return (result.results ?? []).map(rowToVerificationRecord)
  }
}
