import type { ClaimFtsBackend, FtsSearchResult } from '../types'

export class D1ClaimFtsBackend implements ClaimFtsBackend {
  constructor(private readonly db: D1Database) {}

  async search(query: string, flowRunId: string, limit = 10): Promise<FtsSearchResult[]> {
    const result = await this.db
      .prepare(
        `SELECT c.claim_id, c.claim_text, fts.rank AS score
         FROM evidence_claims_fts fts
         JOIN evidence_claims c ON fts.rowid = c.claim_id
         WHERE fts.claim_text MATCH ? AND c.flow_run_id = ?
         ORDER BY fts.rank
         LIMIT ?`,
      )
      .bind(query, flowRunId, limit)
      .all<{ claim_id: number; claim_text: string; score: number }>()

    return (result.results ?? []).map((row) => ({
      claimId: row.claim_id,
      claimText: row.claim_text,
      score: row.score,
    }))
  }
}
