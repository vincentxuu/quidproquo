import type { ClaimRecord, ClaimStoreBackend } from '../types'

const nowMs = () => Date.now()

function rowToClaimRecord(row: Record<string, unknown>): ClaimRecord {
  return {
    claimId: row.claim_id as number,
    claimText: row.claim_text as string,
    claimHash: row.claim_hash as string,
    agentId: (row.agent_id as string | null) ?? null,
    confidence: row.confidence as number,
    flowRunId: (row.flow_run_id as string | null) ?? null,
    flowStepRunId: (row.flow_step_run_id as string | null) ?? null,
    agentRunId: (row.agent_run_id as string | null) ?? null,
    createdAt: row.created_at as number,
  }
}

export class D1ClaimStoreBackend implements ClaimStoreBackend {
  constructor(private readonly db: D1Database) {}

  async insert(input: Parameters<ClaimStoreBackend['insert']>[0]): Promise<number> {
    const now = nowMs()
    await this.db
      .prepare(
        `INSERT OR IGNORE INTO evidence_claims
          (claim_text, claim_hash, agent_id, confidence, flow_run_id, flow_step_run_id, agent_run_id, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        input.claimText,
        input.claimHash,
        input.agentId ?? null,
        input.confidence ?? 0.5,
        input.flowRunId ?? null,
        input.flowStepRunId ?? null,
        input.agentRunId ?? null,
        now,
      )
      .run()

    const row = await this.db
      .prepare(
        'SELECT * FROM evidence_claims WHERE flow_run_id IS ? AND claim_hash = ?',
      )
      .bind(input.flowRunId ?? null, input.claimHash)
      .first<Record<string, unknown>>()

    return rowToClaimRecord(row!).claimId
  }

  async getById(claimId: number): Promise<ClaimRecord | null> {
    const row = await this.db
      .prepare('SELECT * FROM evidence_claims WHERE claim_id = ?')
      .bind(claimId)
      .first<Record<string, unknown>>()
    return row ? rowToClaimRecord(row) : null
  }

  async listForFlowRun(flowRunId: string): Promise<ClaimRecord[]> {
    const result = await this.db
      .prepare('SELECT * FROM evidence_claims WHERE flow_run_id = ? ORDER BY created_at ASC')
      .bind(flowRunId)
      .all<Record<string, unknown>>()
    return (result.results ?? []).map(rowToClaimRecord)
  }
}
